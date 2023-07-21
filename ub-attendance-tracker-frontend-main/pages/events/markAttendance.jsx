import { userService } from 'services';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomSpinner from 'components/CustomSpinner';

export default MarkEventAttendance;

function MarkEventAttendance() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [errorMessage,setErrorMessage] = useState("Failed to record attendance. Please try again!");
    const { id } = router.query;

    useEffect(() => {
        if (!id || response){
            return;
        }
        userService.markEventAttendance(id)
            .then((response) => {
                    setResponse(response);
                    setLoading(false);
            }).catch((error) => {
                    if (error?.error?.message){
                        setErrorMessage(error?.error?.message);
                    }
                    setLoading(false);
            })
    }, [id]);

    return (
        <>
            {!loading ? (
                <>
                    {
                        response && response.data && response.data.attended === true ? (
                            <p>Your attendance has been recorded for {response.data.event ? response.data.event.title : "the event"}!</p>
                        ) : (
                            <p>{errorMessage}</p>
                        )
                    }
                </>
            ) : (
                <CustomSpinner />
            )}
            
        </>
    );
}