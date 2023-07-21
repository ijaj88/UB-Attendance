import React, { useState, useRef, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { userService } from 'services';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor';
import { Spinner } from 'react-bootstrap';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip as  BootStrapTooltip} from 'react-bootstrap';

ChartJS.register(
    ArcElement, Tooltip, Legend
);

const FilteredEvents = ({filters}) => {

  const [allEventData, setAllEventData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    userService.getAllEventsAttendance().then(
      (output) =>{
        // const result = output.data.sort((a,b)=>{
        //   return new Date(a.createdAt) - new Date(b.attendanceTimestamp);
        // });
        setAllEventData(output.data);
      }
    )
  }, [])

  const countData2 = allEventData.reduce((counts, item) => {
    
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

  const sortedData = Object.entries(countData2).sort((a, b) => b[1] - a[1]).slice(0,10);
  
  const chartData2 = {
    
    labels: sortedData.map(pair => pair[0]),
    datasets: [
      {
        data: sortedData.map(pair => pair[1]),
        backgroundColor: randomColor({
          count: sortedData.length,
          luminosity: 'light',
          seed: 35
        }),
        hoverOffset: 30
      },
    ],
  };

  const chartOptions2 = {
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

  const tooltipContainerStyle = {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  };

  const renderTooltip = (props) => (
    <BootStrapTooltip id="overlay-tooltip" {...props}>
      Drill Down of User Attendance Across Events based upon the filters selected in above Pie Distribution.
    </BootStrapTooltip>
  );

  return (
    <>
      <h4 style={{ textAlign: 'center' }}>Events your Pie selected group is interested In</h4>
      <div style={{ display: 'flex' }}>
        {Object.entries(filters).map(([key, value]) => (
          <div key={key} style={{ marginRight: '1rem' }}>
            <strong>{key}: </strong>
            {value ? value : "All"}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
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
        {Object.values(countData2).some(value => value !== 0) ?
          <Bar data={chartData2} options={chartOptions2} plugins={[ChartDataLabels]} /> :
          <p style={{ padding: '100px 200px' }}>No Data</p>}
      </div>
    </>
  );
};

export default FilteredEvents;