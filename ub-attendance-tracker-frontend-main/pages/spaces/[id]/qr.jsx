import { userService } from 'services';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export default SpaceQR;

function SpaceQR() {
    const [space, setSpace] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id){
            return;
        }
        userService.getSpaceById(id)
            .then(x => {
                setSpace(x);
                setLoading(false);
            })
            .catch(error => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch Space. Please refresh!");
                }
            })
    }, [id]);

    return (
        <>
            {!loading ? 
                <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h5>Scan QR Code</h5>
                        {/* <h5 style={{fontSize:'15px'}}>|</h5> */}
                        <div style={{ height: "20%", borderLeft: "1.5px solid #000000", marginLeft: "10px", paddingLeft: "10px" }}>
                            <h5>{space.data.title}</h5>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={space.data.qr.replace('edu/static', 'edu/attendance/static')} height={650} width={650} alt="Space QR" />  
                    </div>
                </>: 
            <CustomSpinner />}
        </>
    );
}