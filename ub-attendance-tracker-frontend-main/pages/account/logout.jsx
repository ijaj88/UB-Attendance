import { userService } from 'services';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default Logout;

function Logout() {
    const router = useRouter();

    useEffect(() => {    
        userService.logout();
        router.push({
            pathname: '/account/login',
            query: { returnUrl: '/' }
        });
        toast.info("Logged out Successfully!");
    }, []);
}