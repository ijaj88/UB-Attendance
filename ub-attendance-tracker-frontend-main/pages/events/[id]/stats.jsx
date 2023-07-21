import { userService } from 'services';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';
import { Spinner } from 'react-bootstrap';

export default EventStats;

const useInterval = (callback, delay) => {

    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

function formatTimestamp(timestamp) {
    if (!timestamp){
        return 'Polling...';
    }
    const date = new Date(timestamp.replace('Z','-04:00'));
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedDate = `${day}th ${month}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    return formattedDate;
  }

function EventStats() {
    const defaultStats = {"count(*)":"Polling...",firstAttendanceTimestamp:null,lastAttendanceTimestamp:null};
    const [event, setEvent] = useState(null);
    const [basicStats, setBasicStats] = useState(defaultStats);
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id){
            return;
        }
        userService.getEventById(id)
            .then(x => {
                setEvent(x);
                userService.getBasicEventAttendanceStats(id)
                    .then(x => {
                        setBasicStats(x.data[0])
                        setLoading(false);
                    })
                    .catch(error => {
                        if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                            toast.error("Unable to fetch Stats. Please refresh!");
                        }
                    })
            })
            .catch(error => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch Event. Please refresh!");
                }
            })
    }, [id]);

    useInterval(() => {
        if (!id){
            return;
        }
        userService.getBasicEventAttendanceStats(id)
            .then(x => {
                setBasicStats(x.data[0])
            })
            .catch(error => {
                setBasicStats(defaultStats);
            })
        
    }, 1000 * 5);

    return (
        <>
            {loading ?  <CustomSpinner />:
            (<><h4 style={{ fontSize: '18px', paddingBottom: '10px', borderBottom: '1px solid #808080' }}>Basic Event Stats</h4>
            <div className="d-flex justify-content-center align-items-center my-5">
                <div className="card p-3 shadow-lg rounded-lg" style={{ maxWidth: '550px' }}>
                <div className="card-header text-light font-weight-bold" style={{backgroundColor:'#363740'}}>{event.data.title}</div>
                <div className="card-body text-center">
                    <h3 className="display-1 text-info mb-4 font-weight-bold">{basicStats["count(*)"]}</h3>

                    <div className="row">
                    <div className="col">
                        <p className="card-text mb-0 text-muted font-weight-bold">Event Start</p>
                        <p className="card-text">{formatTimestamp(event.data.from)}</p>
                    </div>
                    <div className="col">
                        <p className="card-text mb-0 text-muted font-weight-bold">Event End</p>
                        <p className="card-text">{formatTimestamp(event.data.to)}</p>
                    </div>
                    
                    </div>
                    <div className="row mt-4">
                    <div className="col">
                        <p className="card-text mb-0 text-muted font-weight-bold">First Attendance</p>
                        <p className="card-text">{formatTimestamp(basicStats.firstAttendanceTimestamp)}</p>
                    </div>
                    <div className="col">
                        <p className="card-text mb-0 text-muted font-weight-bold" style={{ whiteSpace: 'nowrap' }}>Latest Attendance</p>
                        <p className="card-text">{formatTimestamp(basicStats.lastAttendanceTimestamp)}</p>
                    </div>
                    
                    </div>
                </div>
                </div>
            </div></>)}
            </>
    );
}