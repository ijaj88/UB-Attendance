import { userService } from 'services';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export default MarkSpaceAttendance;

function MarkSpaceAttendance() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [collectReason, setCollectReason] = useState(true);
    const [response, setResponse] = useState(null);
    const { id } = router.query;
    const [reasons, setReasons] = useState(null);
    const [marked, setMarked] = useState(false);
    const [errorMessage,setErrorMessage] = useState("Failed to record attendance. Please try again!");
    
    useEffect(() => {
        if (id && !marked){
            userService.markSpaceAttendance(id)
            .then((response) => {
                setResponse(response);
                setMarked(true);
                userService.getReasons()
                    .then((output) => {
                        setReasons(output.data);
                        setLoading(false);
                    }).catch((error) => {
                        setCollectReason(false);
                        setLoading(false);
                    })
                
            }).catch((error) => {
                if (error?.error?.message){
                    setErrorMessage(error?.error?.message);
                }
                setCollectReason(false);
                setLoading(false);
            })
        }
    }, [id]);

    function addReasonForAttendance(reasonId) {
        userService.markSpaceAttendanceReason({attendanceId:response.data.spaceToUserAttendanceId,reasonId:reasonId})
        setCollectReason(false);
    }

    return (
        <>
            {!loading ? (
                <>
                    { collectReason ? (
                        <div>
                            <label>Click on your reason of visit</label>
                            <div className="row">
                            {reasons.map(({ id, name }, index) => (
                                <div key={id} className="col-md-12" style={{marginTop:'10px',marginBottom:'10px'}}>
                                <button
                                    style={{textAlign:'left'}}
                                    type="button"
                                    className="btn btn-success btn-block"
                                    onClick={() => addReasonForAttendance(id)}
                                >
                                    {name}
                                </button>
                                
                                { (index + 1) % 2 === 0 ? <div className="w-100"></div> : null }
                                </div>
                            ))}
                            </div>
                        </div>
                        ) : (
                        response && response.data && response.data.attended === true ? (
                            <p>Your attendance has been recorded for {response.data.space ? response.data.space.title : "the space"}!</p>
                        ) : (
                            <p>{errorMessage}</p>
                        )
                    )}
                </>
            ) : (
                <CustomSpinner />
            )}
            
        </>
    );
}