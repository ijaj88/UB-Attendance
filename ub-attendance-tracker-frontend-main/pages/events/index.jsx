import { useRouter } from 'next/router';
import { userService } from 'services';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';
import { confirmAlert } from 'react-confirm-alert'; // Import

export default Events;

function Events({userRoleValue}) {
    const router = useRouter();
    const testDate = '2023-03-04T17:38:24+00:00'
    const user = userService.userValue
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasEditPermission, setHasEditPermission] = useState(false);

    useEffect(() => {
        if (["ADMIN","ASSISTANT"].includes(userRoleValue)){
            setHasEditPermission(true);
        }
        userService.getEvents(eventData.length)
            .then((x) => {
                
                setEventData(x["data"]);
                setLoading(false);
            })
            .catch((error) => {
                
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch events. Please refresh!");
                }
            });
    }, []);

    function formatDate(timestamp) {
        if (timestamp){
            const date = new Date(timestamp.replace('Z','-04:00'));
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month} ${day}, ${year}`;
        }else{
            return '';
        }
    }

    function deleteEvent(id) {
        confirmAlert({
            message: 'Are you sure you want to delete this event?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    userService.deleteEvent(id)
                        .then(x => {
                            
                            setEventData(eventData => eventData.filter(eventData => eventData.id != id));
                        })
                        .catch((error) => {
                            if (error?.error?.statusCode == 500){
                                toast.error("Dependent Data Exists. Event cannot be deleted");
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

    return (
        <>
        {loading ?  <CustomSpinner />: 
            <>
                {hasEditPermission && <div style={{ paddingBottom: '30px' }}>
                    <Link href='/events/create/' type="button" class="btn btn-primary" style={{ borderRadius: '15px' }}>Create Event</Link>
                </div>}
                
                <table>
                    <tbody>
                        <tr>
                            <th style={{ width: "40%", color: "#9FA2B4" }}>Event Details</th>
                            <th style={{ width: "10%", color: "#9FA2B4" }}>{hasEditPermission && 'Edit'}</th>
                            <th style={{ width: "10%", color: "#9FA2B4" }}>{hasEditPermission && 'Remove'}</th>
                            <th style={{ width: "20%", color: "#9FA2B4" }}>Date</th>
                            <th style={{ width: "20%", color: "#9FA2B4" }}>View</th>
                        </tr>
                        {eventData.map((event) => (
                            <tr
                                key={event.id}
                                style={{
                                    borderTop: "0.5pt solid #808080",
                                    borderBottom: "0.5pt solid #808080",
                                }}
                            >
                                <td style={{ padding: "20px 0px" }}>
                                    <div style={{ display: "flex" }}>
                                        <div
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                backgroundColor: "#808080",
                                            }}
                                        ></div>
                                        <h6 style={{ marginLeft: "10px" }}>{event.title}</h6>
                                    </div>
                                </td>
                                <td>
                                    {hasEditPermission && <button
                                        onClick={() => router.push(`/events/${event.id}/edit`)}
                                        style={{ border: "none", backgroundColor: "#FFFFFF" }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} size="lg" />
                                    </button>}
                                </td>
                                <td>
                                    {hasEditPermission && <button
                                        onClick={() => deleteEvent(event.id)}
                                        style={{ border: "none", backgroundColor: "#FFFFFF" }}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                                    </button>}
                                </td>
                                <td>
                                    <h6>{formatDate(event.from)}</h6>
                                </td>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/events/${event.id}/stats`)}
                                            class="btn btn-secondary btn-sm rounded-pill"
                                            style={{ paddingLeft: "20px", paddingRight: "20px" }}
                                        >
                                            Stats
                                        </button>
                                        <div
                                            style={{
                                                height: "100%",
                                                borderLeft: "1px solid #000000",
                                                marginLeft: "10px",
                                                paddingLeft: "10px",
                                            }}
                                        >
                                            <img
                                                src="/attendance/placeholderQR.png"
                                                onClick={() => router.push(`/events/${event.id}/qr`)}
                                                style={{ width: "30%", height: "30%" }}
                                                alt=""
                                                className="rounded-pill"
                                            ></img>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>    
            }
        </>
    );
}


