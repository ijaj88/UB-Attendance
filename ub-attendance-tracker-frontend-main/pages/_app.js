import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import 'react-confirm-alert/src/react-confirm-alert.css';
import 'styles/globals.css';
import { Nava } from 'components';
import { userService } from 'services';
import Layout from 'components/layout';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ToastContainer, toast } from 'react-toastify';
import { useRouteHandler  } from 'helpers/utils';
import 'react-toastify/dist/ReactToastify.css';

export default App;

function App({ Component, pageProps }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [showPage, setShowPage] = useState(false);
    config.autoAddCss = false;
    // const handleRouteChange = useRouteHandler();
    useEffect(() => {
        // 
        // if (location.protocol === "https:") {
        //     location.href = "http:" + window.location.href.substring(window.location.protocol.length);
        // }
        authCheck(router.asPath);
        // 
        
        

        // const handleRouteChange = (url) => {
        //     
        //     if (url.split('?')[0] === "/"){
        //         if (userService.userRoleValue === "ADMIN") {
        //             router.replace("/events");
        //         } else if (userService.userRoleValue === "USER") {
        //             router.replace("/myProfile");
        //         } else if (userService.userRoleValue === "PRESENTER") {
        //             router.replace("/events");
        //         } else if (userService.userRoleValueRole === "ASSISTANT") {
        //             router.replace("/events");
        //         } 
        //     }
        //   };
        if (router.asPath.split('?')[0] === "/"){ 
            router.push('/myProfile')
        }
        
        const hideContent = () => {
            setShowPage(false);
            setAuthorized(false);
        }
        router.events.on('routeChangeStart', hideContent);
        router.events.on('routeChangeComplete', authCheck);
        // router.events.on("beforeHistoryChange", handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
            // router.events.off("beforeHistoryChange", handleRouteChange);
        }
    }, []);

    function authCheck(url) {
        const publicPaths = ['/attendance/account/login/','/account/login/', '/attendance/account/register/','/account/register/','/attendance/account/verify/','/account/verify/','/account/generatePassword/','/attendance/account/generatePassword/'];
        const paths2 = ['/attendance/account/changePassword/','/account/changePassword/']
        
        const path = url.split('?')[0];
        
        if (userService.userValue){
            if (!paths2.includes(path)) {
                setAuthorized(true);
                if (!userRole){
                    userService.getUserProfile()
                        .then(x => {
                            setUserRole(x["data"]["roles"][0]);
                        })
                        .catch((error)=>{
                            if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError' && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                                toast.error("Failed to fetch profile, please refresh!");
                            }
                            
                        })
                }
            }else{
                setShowPage(true);
            }
            
        }else{
            setAuthorized(false);
            if (publicPaths.includes(path) || paths2.includes(path)) {
                setShowPage(true);
            }else {
                setShowPage(false);
                router.push({
                    pathname: '/account/login/',
                    query: { returnUrl: router.asPath }
                });
            }
        }
    }

    return (
        <>
            <Head>
                <title>Attendance Tracker</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
                <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            </Head>
            <div>
                {!authorized && showPage && <Component {...pageProps} />}
                {authorized && <Layout userRoleValue = {userRole}><Component {...pageProps} /></Layout>}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="colored"
                />
            </div>
        </>
    );
}
