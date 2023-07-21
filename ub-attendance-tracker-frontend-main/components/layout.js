import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { userService } from 'services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartLine, faCalendarAlt, faMapMarkerAlt,faCog,faChartBar,faChartPie, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import CustomSpinner from 'components/CustomSpinner';
import React from 'react';

export default function Layout({ userRoleValue, children }) {
  
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    function handleResize() {
      setMenuOpen(window.innerWidth > 768);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial menuOpen value on mount

    menuItems.forEach(({ href, pageTitle }) => {
      if (router.asPath.startsWith(href)) {
        setPageTitle(pageTitle);
      }
    });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      href: '/myProfile',
      title: 'My Profile',
      icon: faUser,
      pageTitle: 'Check your Profile',
      allowed: ["USER","ADMIN","PRESENTER","ASSISTANT"]
    },
    // {
    //   href: '/myActivity',
    //   title: 'My Activity',
    //   icon: faChartLine,
    //   allowed: ["USER","ADMIN","PRESENTER","ASSISTANT"]
    // },
    {
      href: '/events',
      title: 'Events',
      icon: faCalendarAlt,
      pageTitle: 'Events',
      allowed: ["ADMIN","PRESENTER","ASSISTANT"]
    },
    {
      href: '/spaces',
      title: 'Spaces',
      pageTitle: 'Spaces',
      icon: faMapMarkerAlt,
      allowed: ["ADMIN","PRESENTER","ASSISTANT"]
    },
    {
      href: '/manage',
      title: 'Manage',
      pageTitle: 'Manage',
      icon: faCog,
      allowed: ["ADMIN"]
    },
    {
      href: '/metrics/events',
      title: 'Event Metrics',
      pageTitle: 'Event Metrics',
      icon: faChartBar,
      allowed: ["ADMIN"]
    },
    {
      href: '/metrics/spaces',
      title: 'Space Metrics',
      pageTitle: 'Space Metrics',
      icon: faChartPie,
      allowed: ["ADMIN"]
    },
    {
      href: '/account/logout',
      title: 'Logout',
      icon: faSignOutAlt,
      allowed: ["USER","ADMIN","PRESENTER","ASSISTANT"]
    },
  ];

  return (
    <>
        {["USER","ADMIN","PRESENTER","ASSISTANT"].includes(userRoleValue) ? 
          (<div className='tw-min-h-screen tw-flex tw-flex-row'>
            <aside className={`md:tw-w-${menuOpen ? '50' : '8'} tw-transition-all `} style={{backgroundColor:'#363740'}}>
              <nav>
                <div> 
                  <div style={{display:'flex', paddingTop:'30px',paddingBottom:'8px',textAlign:'center'}}>
                    <p style={{color:'white',paddingLeft:'10px',paddingRight:'10px'}}
                        onClick={() => setMenuOpen(!menuOpen)}
                      >
                        ☰
                    </p>
                    <div className="tw-pr-2 tw-text-xl tw-font-semibold tw-text-white">
                      {menuOpen && <p>UB Attendance Tracker</p>}
                    </div>
                  </div>
                  { (
                    <div>
                      {menuItems.map(({ href, title, icon, allowed }) => (
                        allowed.includes(userRoleValue) && (
                          <div key={title}>
                            <Link legacyBehavior href={href}>
                              <a
                                style={{
                                  color: '#FFFFFF',
                                  opacity: router.asPath.startsWith(href) ? '1' : '0.6',
                                  paddingLeft: '10px',
                                  backgroundColor: router.asPath.startsWith(href) ? 'rgba(159, 162, 180, 0.2)' : 'none',
                                }}
                                className='tw-flex tw-p-3'
                              >
                                <div className="tw-flex tw-items-center tw-mr-2">
                                  <FontAwesomeIcon icon={icon} size="sm"  />
                                </div>
                                <div className="tw-flex-1">
                                  {menuOpen && title}
                                </div>
                              </a>
                            </Link>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </aside>
            <main className='tw-flex-1'>
            <div style={{ backgroundColor: '#F7F8FC', padding: '20px' }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ paddingLeft: '10px' }}><strong>{pageTitle}</strong></p>
                    <div style={{ display: "flex" }}>
                        <p style={{ paddingRight: "10px" }}>{userRoleValue}</p>
                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#FFFFFF", border: "0.1px solid #808080" }}></div>
                    </div>
                </div>
                <div className="container-fluid" style={{ backgroundColor: '#FFFFFF', padding: '20px', height: 'auto', minHeight: '100vh' }}>
                  {React.cloneElement(children, { userRoleValue: userRoleValue })}
                </div>
            </div>
            </main>
          </div>) :  <CustomSpinner />
        }
      </>
  );
}