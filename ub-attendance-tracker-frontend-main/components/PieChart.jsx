import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { userService } from 'services';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor';
import { Spinner } from 'react-bootstrap';

ChartJS.register(
    ArcElement, Tooltip, Legend
);

const PieChart = ({eventId}) => {

  const [fromDate, setFromDate] = useState(new Date().toISOString().substr(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
  const [loading, setLoading] = useState(true);

  const chartOptions= {
    plugins: {
        legend: {
            position: 'right',
        },
        title: {
            display: true,
            text: 'Attendance Distribution'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label;
              const index = context.dataIndex;
              const count = chartData.countData[index];
              const percentage = chartData.percentageData[index];
              return `${label}: ${count} (${percentage.toFixed(0)}%)`;
            }
          }
        }
      },
    maintainAspectRatio: false,
    responsive: true
  };

  const dropdown = ["affiliation","department"]

  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [selectedAttribute, setSelectedAttribute] = useState('affiliation');


  useEffect(() => {
    setLoading(true)
    userService.getEventsAttendanceGroupedByAttribute(selectedAttribute).then(
      (output) =>{
        const labels = output.data.map((input) => input[selectedAttribute]);
        const counts = output.data.map((input) => input.count);
        const percentages = counts.map((count) => (count / counts.reduce((a, b) => a + b, 0)) * 100);

        setChartData({
          labels: labels,
          datasets: [
              {
                  label: '# of Attendees',
                  data: counts,
                  backgroundColor: randomColor({
                    count: output.data.length,
                    luminosity: 'light',
                    seed: 35
                  }),
                  hoverOffset: 30
                }
          ],
          countData: counts,
          percentageData: percentages
        });
        setLoading(false);
      }
    ).catch((error) => {
      toast.error("Unknown Error");
    })
    
  }, [fromDate,toDate,selectedAttribute])

  const handleDropdownChange = (event) => {
    setSelectedAttribute(event.target.value);
  };

  return (
    <div style={{border:'1px solid black',padding:'20px'}}>
      <label htmlFor="dropdown" style={{paddingRight:'10px'}} >Distribute By  </label>
      <select id="dropdown" value={selectedAttribute} onChange={handleDropdownChange}>
        {dropdown.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label for="from">From:</label>
      <input type="date" id="from" name="from" value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}></input>
      <label for="to">To:</label>
      <input type="date" id="to" name="to" value={toDate}
        onChange={(e) => setToDate(e.target.value)}></input>
      {loading ? <Spinner /> : <div className='w-full md:col-span-2 relative lg:h-[10vh] h-[10vh] m-auto p-4 border rounded-lg bg-white'>
        
         <Pie data={chartData} options={chartOptions} />

      </div>}
    </div>
  );
};

export default PieChart;