import { useRouter } from 'next/router';
import { userService } from 'services';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';
import { confirmAlert } from 'react-confirm-alert'; // Import

export default Events;

function Events({userRoleValue}){
    const router = useRouter();
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasEditPermission, setHasEditPermission] = useState(false);

    function formatDate(timestamp) {
        const date = new Date(timestamp.replace('Z','-04:00'));
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    function deleteSpace(id) {
        confirmAlert({
            message: 'Are you sure you want to delete this space?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    userService.deleteSpace(id)
                        .then(x => {
                            setEventData(eventData => eventData.filter(eventData => eventData.id != id));
                        })
                        .catch((error) => {
                            if (error?.error?.statusCode == 500){
                                toast.error("Dependent Data Exists. Space cannot be deleted");
                            }
                            else if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                                toast.error("Unable to Delete Event. Please try again!");
                            }
                        })
                }
              },
              {
                label: 'No',
                onClick: () => { }
              }
            ],
            closeOnClickOutside: false,
          });
        
    }

    useEffect(() => {
        if (["ADMIN","ASSISTANT"].includes(userRoleValue)){
            setHasEditPermission(true);
        }
        userService.getSpaces()
            .then(x => {
                
                setEventData(x["data"]);
                setLoading(false);
            })
            .catch((error) =>{
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch spaces. Please refresh!");
                }
            })
    }, []);

    return (
        <>
        {loading ?  <CustomSpinner />:
            (<>
                {hasEditPermission && <div style={{ paddingBottom: '30px' }}>
                    <Link href='/spaces/create' type="button" class="btn btn-primary" style={{ borderRadius: '15px' }}>Create Space</Link>
                </div>}

                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "40%", color: "#9FA2B4" }}>Event Details</th>
                            <th style={{ width: "10%", color: "#9FA2B4" }}>{hasEditPermission && 'Edit'}</th>
                            <th style={{ width: "10%", color: "#9FA2B4" }}>{hasEditPermission && 'Remove'}</th>
                            <th style={{ width: "20%", color: "#9FA2B4" }}>Date</th>
                            <th style={{ width: "20%", color: "#9FA2B4" }}>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventData.map(event => (
                            <tr key={event.id} style={{ borderTop: "0.5pt solid #808080", borderBottom: "0.5pt solid #808080" }}>
                                <td style={{ padding: "20px 0px" }}>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#808080" }}></div>
                                        <h6 style={{ marginLeft: "10px" }}>{event.title}</h6>
                                    </div>
                                </td>
                                <td>
                                    {hasEditPermission && <button onClick={() => router.push(`/spaces/${event.id}/edit`)} style={{ border: 'none', backgroundColor: '#FFFFFF' }}>
                                        <FontAwesomeIcon icon={faEdit} size="lg" />
                                    </button>}
                                </td>
                                <td>
                                    {hasEditPermission && <button onClick={() => deleteSpace(event.id)} style={{ border: 'none', backgroundColor: '#FFFFFF' }}>
                                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                                    </button>}
                                </td>
                                <td>
                                    <h6>{formatDate(event.createdAt)}</h6>
                                </td>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <button type="button" className="btn btn-secondary btn-sm rounded-pill" style={{ paddingLeft: "20px", paddingRight: "20px" }} onClick={() => router.push(`/spaces/${event.id}/stats`)}>Stats</button>
                                        <div style={{ height: "100%", borderLeft: "1px solid #000000", marginLeft: "10px", paddingLeft: "10px" }}>
                                            <img src="/attendance/placeholderQR.png" onClick={() => router.push(`/spaces/${event.id}/qr`)} style={{ width: "30%", height: "30%" }} alt="" className="rounded-pill"></img>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>)
        }
        </>
    );
}


