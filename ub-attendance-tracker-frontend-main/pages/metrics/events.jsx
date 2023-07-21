import AllEventChart from '../../components/charts/events/AllEventChart';
import EventPieDistribution from '../../components/charts/events/EventPieDistribution';
import AllEventAttendanceChart from '../../components/charts/events/AllEventAttendanceChart';
import EventBarChartPerSeries from '../../components/charts/events/EventBarChartPerSeries';
import DownloadButton from '../../components/DownloadButton.jsx';
import Select from 'react-select';
import DoughnutChart from '../../components/DoughnutChart';
import LineChart from '../../components/LineChart';
import { userService } from 'services';
import { useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import CustomSpinner from 'components/CustomSpinner';

export default function EventMetrics({userRoleValue}) {
    
    const [eventOptions, setEventOptions] = useState([]);
    const [seriesOptions, setSeriesOptions] = useState([]);
    const [eventId, setEventId] = useState(null);
    const [seriesId, setSeriesId] = useState(null);
    const [eventFromDate, setEventFromDate] = useState(null);
    const [eventData, setEventData] = useState(null)
    
    const [eventInfo, setEventInfo] = useState(null);
    const [seriesInfo, setSeriesInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (userRoleValue === undefined){
            return;
        }
        if(["ADMIN"].includes(userRoleValue)){
            setLoading(false);
            userService.getAllEvents()
                .then(x => {
                    setEventData(x["data"]);
                })
                .catch((error)=>{
                    if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                        toast.error("Unable to fetch events. Please refresh!");
                    }
                })
            
            userService.getSeries()
                .then(x => {
                    setSeriesOptions(x["data"].map(obj => {
                        return {
                            label: obj["name"],
                            value: obj["id"],
                            createdAt: obj["createdAt"]
                        };
                        }));
                })
                .catch((error)=>{
                    if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                        toast.error("Unable to fetch series. Please refresh!");
                    }
                })
        } else{
            router.push('/404');
        }
    }, []);

    useEffect(() => {
        var filteredEventData = seriesInfo ? eventData.filter((i) => i.series && i.series.id == seriesInfo["value"]) : eventData;
        
        setEventOptions(filteredEventData?.map(obj => {
          return {
            label: obj["title"],
            value: obj["id"],
            createdAt: obj["createdAt"]
          };
        }));
      }, [seriesInfo, eventData]); 

    const handleEventChange = (selectedOption) => {
        // if (selectedOption === null){
        //     setEventId(null);
        // }else{
        //     setEventId(selectedOption.value);
        //     setEventFromDate(selectedOption.fromDate);
        // }
        setEventInfo(selectedOption);
    };

    const handleSeriesChange = (selectedOption) => {
        // if (selectedOption === null){
        //     setSeriesId(null);
        // }else{
        //     setSeriesId(selectedOption.value);
        //     setEventId(null);
        // }
        setEventInfo(null);
        setSeriesInfo(selectedOption);
    };

    return (
        <>
            {loading ?  <CustomSpinner />: (<div style={{minHeight:'180vh'}}>
                
                    <AllEventChart />
                    <AllEventAttendanceChart />
                    
                    <div className='row' style={{alignItems:'center'}}>
                        <div className='col-1'>
                            <h6><strong>Series</strong></h6>
                        </div>
                        <div className='col-11'>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="series"
                                isClearable={true}
                                options={seriesOptions}
                                onChange={handleSeriesChange} 
                            />
                        </div>
                    </div>

                    <div className='row' style={{marginTop:'20px', alignItems:'center'}}>
                        <div className='col-1'>
                            <h6><strong>Event</strong></h6>
                        </div>
                        <div className='col-11'>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="events"
                                isClearable={true}
                                options={eventOptions}
                                value={eventInfo}
                                onChange={handleEventChange} 
                            />
                        </div>
                    </div>
                    <div style={{textAlign:'right', margin:'20px'}}>
                        <DownloadButton prefix={seriesInfo ? 'series' : 'event'} statId={seriesInfo ? 17 : 18} uuid={seriesInfo ? seriesInfo.value : eventInfo?.value} spaceId={eventInfo?.["value"]}  name={seriesInfo ? seriesInfo.label : eventInfo?.label} />
                    </div>
                    
                    <EventPieDistribution eventInfo={eventInfo} seriesInfo={seriesInfo}/>
                    {seriesInfo && <EventBarChartPerSeries seriesInfo={seriesInfo}/>}
                    {/* <LineChart /> */}
                    {/* <EventAttendanceChart eventId={eventId} eventFromDate={eventFromDate}/> */}
                    {/* <DoughnutChart /> */}
                    
                </div>
            )}
        </>
    );
}