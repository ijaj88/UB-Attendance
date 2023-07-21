import { useState, useEffect } from 'react';
import { userService } from 'services';

export { Nava };

function Nava({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const subscription = userService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    function logout() {
        userService.logout();
    }

    // only show nav when logged in
    if (!user) return null;
    
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <nav className="navbar navbar-expand-lg navbar-light bs-side-navbar" style={{backgroundColor:'#363740',flexDirection:'column',height:'100vh',alignItems:'flex-start'}}>
                <a className="navbar-brand" style={{color:'#FFFFFF'}}>UB Attendance Tracker</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" style={{flexDirection:'column'}} id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto" style={{flexDirection:'column'}}>
                        <li className="nav-item active">
                            <a className="nav-link selected" href="/myProfile" style={{color:'#FFFFFF'}}>My Profile <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/inDev" style={{color:'#FFFFFF'}}>My Activity</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/events" style={{color:'#FFFFFF'}}>Events</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/inDev" style={{color:'#FFFFFF'}}>Spaces</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={logout} style={{color:'#FFFFFF'}}>Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div style={{display: 'flex', width: '100%' }}>
                {children}
            </div>
        </div>
    );
}