import SpaceAttendanceChart from '../../components/charts/spaces/SpaceAttendanceChart';
import AllSpaceChart from '../../components/charts/spaces/AllSpaceChart';
import SpacePieDistribution from '../../components/charts/spaces/SpacePieDistribution';
import AllSpaceAttendanceChart from '../../components/charts/spaces/AllSpaceAttendanceChart';
import EventAttendanceChart from '../../components/charts/spaces/EventAttendanceChart';
import DownloadButton from '../../components/DownloadButton.jsx';
import DoughnutChart from '../../components/DoughnutChart';
import LineChart from '../../components/LineChart';
import CustomSpinner from 'components/CustomSpinner';


import Select from 'react-select';
import { userService } from 'services';
import { useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function SpaceMetrics({userRoleValue}) {
    
    const [spaceOptions, setSpaceOptions] = useState([]);
    const [spaceId, setSpaceId] = useState(null);
    const [spaceFromDate, setSpaceFromDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [spaceInfo, setSpaceInfo] = useState(null);

    useEffect(() => {
        if (userRoleValue === undefined){
            return;
        }
        if( ["ADMIN"].includes(userRoleValue) ){
            setLoading(false);
            userService.getAllSpaces()
                .then(x => {
                    setSpaceOptions(x["data"].map(obj => {
                        return {
                            label: obj["title"],
                            value: obj["id"],
                            fromDate: obj["createdAt"]
                        };
                    }));
                })
                .catch((error)=>{
                    if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                        toast.error("Unable to fetch spaces. Please refresh!");
                    }
                })
        } else{
            router.push('/404');
        }
    }, []);

    const handleEventChange = (selectedOption) => {
        // setSpaceId(selectedOption.value);
        // setSpaceFromDate(selectedOption.fromDate);
        setSpaceInfo(selectedOption);
    };

    return (
        <>
            {loading ?  <CustomSpinner /> : 
                (<div style={{minHeight:'180vh'}}>
                    <AllSpaceChart />
                    <AllSpaceAttendanceChart />
                    <div className='row' style={{alignItems:'center'}}>
                        <div className='col-1'>
                            <h6><strong>Space</strong></h6>
                        </div>
                        <div className='col-11'>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="spaces"
                                options={spaceOptions}
                                isClearable={true}
                                onChange={handleEventChange} 
                            />
                        </div>
                    </div>
                    <div style={{textAlign:'right', margin:'20px'}}>
                        <DownloadButton prefix={'space'} statId={16} uuid={spaceInfo?.value} name={spaceInfo?.label} />
                    </div>
                    
                    <SpacePieDistribution spaceId={spaceInfo?.value} spaceFromDate={spaceInfo?.fromDate}/>
                    <SpaceAttendanceChart spaceId={spaceInfo?.value} spaceFromDate={spaceInfo?.fromDate}/>                
                    <EventAttendanceChart spaceId={spaceInfo?.value} />
                </div>)
            }
        </>
    );
}