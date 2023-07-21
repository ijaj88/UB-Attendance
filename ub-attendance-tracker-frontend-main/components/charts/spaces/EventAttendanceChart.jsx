import React, { useState, useRef, useEffect } from 'react';
import { Bar,Line } from 'react-chartjs-2';
import { userService } from 'services';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor';
import { Spinner } from 'react-bootstrap';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip as BootStrapTooltip } from 'react-bootstrap';
import * as moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EventAttendanceChart = ({spaceId}) => {
  if(!spaceId){
    return;
  }
  // const [fromDate, setFromDate] = useState(new Date().toISOString().substr(0, 10));
  // const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
  const target = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const chartOptions = {
    "plugins": {
        "legend": {
            "display": false,
            "position": "right"
        },
        "datalabels": {
            "anchor": "end",
            "align": "top",
            "color": "#41ac7d",
            "font": {
                "weight": "bold",
                "size": 13
            }
        }
    },
    "maintainAspectRatio": false,
    "responsive": true,
    "layout": {
        "padding": {
            "top": 30,
            "bottom": 0,
            "left": 0,
            "right": 0
        }
    }
  }

  useEffect(() => {
    if (!spaceId){
      return;
    }
    setLoading(true)
    userService.getEventAttendanceWithSpaceId(spaceId).then(
      (output) =>{
        
        const result = output.data.sort((a,b)=>{
          return new Date(a.attendanceTimestamp) - new Date(b.attendanceTimestamp);
        });
        setData(result);
        setLoading(false);
      }
    ).catch((error) => {
      setLoading(false);
      if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
        toast.error("Unable to Fetch Data. Please Refresh");
      }
    })
    
  }, [spaceId])

  const [filters, setFilters] = useState({"department":"All","level":"All","affiliations":"All"});

  const countData = data.reduce((counts, item) => {
    
    if (
      Object.keys(filters).some(filterKey => {
        if (filterKey == "affiliations"){
          return filters[filterKey]!="All" && !(item[filterKey] === null ? "null" : item[filterKey].toString()).includes(filters[filterKey]);
        }else{
          return filters[filterKey]!="All" && (item[filterKey] === null ? "null" : item[filterKey].toString()) != filters[filterKey];
        }
      })
    ) {
      return counts;
    }
    var key = item['eventTitle']
    counts[key] = counts[key] ? counts[key] + 1 : 1;
    return counts;
  }, {});

  const chartData = {
    labels: Object.keys(countData),
    datasets: [
      {
        data: Object.values(countData),
        backgroundColor: randomColor({
          count: Object.keys(countData).length,
          luminosity: 'light',
          seed: 35
        }),
        hoverOffset: 30
      },
    ],
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const renderTooltip = (props) => (
    <BootStrapTooltip id="overlay-tooltip" {...props}>
      For the selected Space, this graph shows the User Attendance across Events linked with the Space
    </BootStrapTooltip>
  );

  const tooltipContainerStyle = {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  };

  const chartFilters = Object.keys(filters);

  return (
    <div style={{padding:'50px'}}>
      <h4 style={{textAlign:'center'}}>Event Attendance In Selected Space</h4>
      {/* <label>
          Distribute By:
          <select style={{width:'150px',marginLeft:'12px',marginRight:'30px'}} value={chartFilter} onChange={(event) => setChartFilter(event.target.value)}>
            {attributes.map((filter) => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </label> */}
      {/* <label>
        From:
        <input style={{width:'150px',marginLeft:'12px',marginRight:'30px'}} type="date" id="from" name="from" value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}></input>
      </label>
      
      <label>
        To:
        <input style={{width:'150px',marginLeft:'12px',marginRight:'30px'}} type="date" id="to" name="to" value={toDate}
          onChange={(e) => setToDate(e.target.value)}></input>
      </label> */}
      {loading && <Spinner style={{size:'10px'}} /> }
      
      <div className='row'>
        <div className='col-4'>
        <p><strong>Filter By</strong></p>
          {chartFilters.map((filter) => (
            <div className='row'>
                <div className='col-4'>
                  <label key={filter}>
                    {`${filter}:`}
                  </label>
                </div>
                <div className='col-8'>
                  <select style={{width:'150px'}} name={filter} value={filters[filter]} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    {data.reduce((options, item) => {
                      const value = item[filter];
                      if (filter == "affiliations"){
                        if (value === null){
                          if (!options.includes("null")) {
                            options.push("null");
                          }
                        }else{
                          value?.split(", ").forEach((eachAffiliaton)=>{
                            if (!options.includes(eachAffiliaton)) {
                              options.push(eachAffiliaton);
                            }
                          })
                        }
                      }else{
                        if (!options.includes(value)) {
                          options.push(value);
                        }
                      }
                      return options;
                    }, []).map((option) => (
                      <option key={option} value={option}>
                        {option === null ? 'null' : option}
                      </option>
                    ))}
                  </select>
                </div>
              
            </div>
          ))}
        </div>
        <div className='col-8'>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={tooltipContainerStyle}>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <div>
              <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
            </div>
          </OverlayTrigger>
        </div>
      </div>
      {Object.values(countData).some(value => value !== 0) ?  <div>
          <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
      </div>: <p style={{padding:'100px 200px'}}>No Data</p>}  
    </div>
  );
};

export default EventAttendanceChart;