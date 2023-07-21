import { userService } from 'services';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export default EditEvent;

function EditEvent() {
    const [event, setEvent] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id){
            return;
        }
        userService.getEventById(id)
            .then(x => {
                setEvent(x);
                setLoading(false);
            })
            .catch(error => {
                console.log("kill",error);
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch Event. Please refresh!");
                }
            })
    }, [id]);

    return (
        <>
            {loading ?  <CustomSpinner />:
                (<>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h5>Scan QR Code</h5>
                        {/* <h5 style={{fontSize:'15px'}}>|</h5> */}
                        <div style={{ height: "20%", borderLeft: "1.5px solid #000000", marginLeft: "10px", paddingLeft: "10px" }}>
                            <h5>{event.data.title}</h5>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={event.data.qr.replace('edu/static', 'edu/attendance/static')} height={650} width={650} alt="Event QR" />  
                    </div>
                </>)
            }
        </>
    );
}