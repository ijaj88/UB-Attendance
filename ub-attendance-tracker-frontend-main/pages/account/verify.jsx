import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { userService } from 'services';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export default Verify;

function Verify() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { username, verificationCode } = router.query;

    if (!username || !verificationCode){
      return;
    }

    
    // Make the API call with the username and verification code
    // setLoading(true);
    
    userService.verifyAccount(username, verificationCode)
      .then(output => {
        if (output?.data?.registeredUser == "user verified and created and can log in now") {
          // If the API call was successful, display an alert and redirect to another page
          toast.info('Verification Successful!');
          router.push('/account/login');
        } else {
          // If the API call was not successful, display an error message
          setError('Verification failed. Please try again.');
        }
      })
      .catch((output) => {
        // 
        if (output?.error?.message?.includes('Token not verified')){
          setError("Invalid verification Code. Please register again to get new link");
        }else{
          setError(output?.error?.message || "Unknown Error");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.query]);

  return (
    <div>
      {loading && <CustomSpinner />}
      {error && <p style={{padding:'20px', fontSize: '20px',padding:'20px'}}>{error}</p>}
      {!loading && !error && <p>Verifying...</p>}
    </div>
  );
}