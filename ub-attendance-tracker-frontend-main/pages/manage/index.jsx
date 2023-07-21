import { userService } from 'services';
import { useState, useEffect } from 'react';
import { ReasonList } from '../../components/manage/ReasonList';
import {UserDataUpload, UpdateRole} from 'components/manage';
import { AffiliationsList } from 'components/manage/AffiliationsList';
import CustomSpinner from 'components/CustomSpinner';
import { useRouter } from 'next/router';

export default Manage;

function Manage({userRoleValue}) {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (userRoleValue === undefined){
            return;
        }
        if(["ADMIN"].includes(userRoleValue)){
            setLoading(false);
        }else{
            router.push('/404');
        }
    }, []);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    let tabContent;

    switch(activeTab) {
        case 0:
            tabContent = <UserDataUpload />;
            break;
        case 1:
            tabContent = <UpdateRole />;
            break;
        case 2:
            tabContent = <ReasonList />;
            break;
        case 3:
            tabContent = <AffiliationsList />;
            break;
        default:
            tabContent = <ReasonList />;
    }

    return (
        <>
        {loading ?  <CustomSpinner />: 
            (<>
                <ul className='nav nav-tabs' role='tablist'>
                    <li className='nav-item'>
                        <a className={`nav-link ${activeTab === 0 ? "active" : ""}`} href='#' onClick={() => handleTabClick(0)}>
                        Upload User Demographic Info
                        </a>
                    </li>
                    <li className='nav-item'>
                        <a className={`nav-link ${activeTab === 1 ? "active" : ""}`} href='#' onClick={() => handleTabClick(1)}>
                        Change Role
                        </a>
                    </li>
                    <li className='nav-item'>
                        <a className={`nav-link ${activeTab === 2 ? "active" : ""}`} href='#' onClick={() => handleTabClick(2)}>
                        Attendance Reasons
                        </a>
                    </li>
                    <li className='nav-item'>
                        <a className={`nav-link ${activeTab === 3 ? "active" : ""}`} href='#' onClick={() => handleTabClick(3)}>
                        Affiliations
                        </a>
                    </li>
                </ul>
                <div style={{marginTop:'30px'}}>{tabContent}</div>
                
            </>)
        }
        </>

    );

}