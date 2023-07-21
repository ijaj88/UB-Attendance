import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { userService } from 'services';

export default Home;

function Home() {
    // const router = useRouter();
    // const [userRole, setUserRole] = useState(null);
    
    // useEffect(() => {
    //     setUserRole(userService.getUserRole());
    // }, []);
    
    // if (userRole === "ADMIN"){
    //     router.replace("/inDev");
    // }else if (userRole === "USER"){
    //     router.replace("/myProfile");
    // }else if (userRole === "PRESENTER"){
    //     router.replace("/events");
    // }else if (userRole === "ASSISTANT"){
    //     router.replace("/events");
    // }
    return (
        <></>
        );
}