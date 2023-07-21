import React, { useState, useEffect } from 'react';
import { Bar,Line } from 'react-chartjs-2';
import { userService } from 'services';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor';
import { Spinner } from 'react-bootstrap';
import ChartDatalabel2s from 'chartjs-plugin-datalabels';
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

const SpaceBarChartPerSelection = ({filters2,chartFilter2,label2}) => {
  
  if (filters2 == null || chartFilter2 == null){
    return;
  }
  // const [fromDate, setFromDate] = useState(new Date().toISOString().substr(0, 10));
  // const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
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
    setLoading(true);
    userService.getSpaceAttendance().then(
      (output) =>{
        setData(output.data);
        setLoading(false);
      }
    ).catch((error) => {
      setLoading(false);
      if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
        toast.error("Unable to Fetch Data. Please Refresh!");
      }
    })
    
  }, [])

  
  const countData = data.reduce((counts, item) => {
    
    if (
      Object.keys(filters2).some(filterKey => {
        if (filterKey == "affiliations"){
          return filters2[filterKey]!="All" && !(item[filterKey] === null ? "null" : item[filterKey].toString()).includes(filters2[filterKey]);
        }else{
          return filters2[filterKey]!="All" && (item[filterKey] === null ? "null" : item[filterKey].toString()) != filters2[filterKey];
        }
      })
    ) {
      return counts;
    }
    var key = item['attendanceTimestamp']
    // 

    if ((chartFilter2 == "daily" && key.slice(0,10) == label2) ||
    (chartFilter2 == "monthly" && key.slice(0,7) == label2) ||
    (chartFilter2 == "weekly" && `${moment(key).isoWeekYear()}-W${moment(key).isoWeek()}` == label2) ||
    (chartFilter2 == "yearly" && key.slice(0,4) == label2)
    ){
      // 
      
      var key2 = item['spaceTitle'];
      counts[key2] = counts[key2] ? counts[key2] + 1 : 1;
    }
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

  return (
    <div style={{padding:'50px'}}>
      <h4 style={{textAlign:'center'}}>Event Distribution</h4>
      
      <div style={{ display: 'flex' }}>
        {Object.entries(filters2).map(([key, value]) => (
          <div key={key} style={{ marginRight: '1rem' }}>
            <strong>{key}: </strong>
            {value ? value : "All" }
          </div>
        ))}
      </div>

      {Object.values(countData).some(value => value !== 0) ?  <div>
          <Bar data={chartData} options={chartOptions} plugins={[ChartDatalabel2s]} />
      </div>: <p style={{padding:'100px 200px'}}>No Data</p>}  
    </div>
  );
};

export default SpaceBarChartPerSelection;