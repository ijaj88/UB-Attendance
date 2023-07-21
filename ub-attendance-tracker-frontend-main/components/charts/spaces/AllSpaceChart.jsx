import React, { useState, useRef, useEffect } from 'react';
import { Bar,Line } from 'react-chartjs-2';
import { userService } from 'services';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor';
import { Spinner } from 'react-bootstrap';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip as BootStrapTooltip } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  PointElement
);

const AllSpaceChart = () => {

  // const [fromDate, setFromDate] = useState(new Date().toISOString().substr(0, 10));
  // const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);
  const [myOptions, setMyOptions] = useState(null);

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
        position: 'right',
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
          type: 'time',
          time: {
            parser: 'YYYY-MM-DDTHH:mm:ssZ',
            tooltipFormat: 'YYYY-MM-DDTHH:mm:ssZ',
            unit: 'day'
          },
          ticks: {
              autoSkip: true,
          }
      },
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        top: 30, // increase top padding to add some height
        bottom: 0,
        left: 0,
        right: 0
      }
    }
  };

  const datalabels = {
    anchor: 'end',
    align: 'top',
    formatter: (value, context) => {
      return `${value}`;
    },
    color: '#41ac7d',
    font: {
      weight: 'bold',
      size: 13
    }
  }

  useEffect(() => {
    setLoading(true)
    userService.getAllSpaces().then(
      (output) =>{
        const result = output.data.sort((a,b)=>{
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setData(result);
        setLoading(false);
      }
    ).catch((error) => {
      setLoading(false);
      if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
        toast.error("Unable to Fetch Data. Please Refresh!");
      }
    })
  }, [])

  const attributes = ["timestamp","daily","weekly","monthly","yearly"];

  // const [filters, setFilters] = useState({"department":null,"ethnicity":null,"gender":null,"level":null});
  const [filters, setFilters] = useState({"department":null,"level":null});
  
  const [chartFilter, setChartFilter] = useState("yearly");

  useEffect(() => {
    let newChartOptions = { ...chartOptions };
    if (chartFilter == 'timestamp'){
      newChartOptions.scales.x.time.parser = 'YYYY-MM-DDTHH:mm:ssZ';
      newChartOptions.scales.x.time.tooltipFormat = 'DD MMM, YYYY - HH:mm';
      newChartOptions.scales.x.time.unit = 'day';

    } else if (chartFilter == 'monthly'){
      newChartOptions.scales.x.time.parser = 'YYYY-MM';
      newChartOptions.scales.x.time.tooltipFormat = 'MMM YYYY';
      newChartOptions.scales.x.time.unit = 'month';
      newChartOptions.plugins["datalabels"] = datalabels;

    } else if (chartFilter == 'yearly'){
      newChartOptions.scales.x.time.parser = 'YYYY';
      newChartOptions.scales.x.time.tooltipFormat = 'YYYY';
      newChartOptions.scales.x.time.unit = 'year';
      newChartOptions.plugins["datalabels"] = datalabels;
    } else if (chartFilter == 'daily'){
      newChartOptions.scales.x.time.parser = 'YYYY-MM-DD';
      newChartOptions.scales.x.time.tooltipFormat = 'DD MMM YYYY';
      newChartOptions.scales.x.time.unit = 'day';
      newChartOptions.plugins["datalabels"] = datalabels;
      
    } else if (chartFilter == 'weekly'){
      newChartOptions.scales = {
        x: {
          type: 'time',
          time: {
            parser: 'YYYY-[W]WW',
            tooltipFormat: 'll',
            unit: 'week',
            // displayFormats: {
            //   week: 'wo',
            // },
          },
        },
        y: {
          beginAtZero: true,
        },
      };
      newChartOptions.plugins["datalabels"] = datalabels;
      
    }
    // setChartOptions(newChartOptions);
    setMyOptions(newChartOptions);
  }, [chartFilter])

  var prevKey = null;

  const countData = data.reduce((counts, item) => {
    
    // if (
    //   Object.keys(filters).some(filterKey => {
    //     return filters[filterKey] && item[filterKey].toString() !== filters[filterKey];
    //   })
    // ) {
    //   return counts;
    // }
    var key = item['createdAt']

    // var key = item['createdAt']
    // 
    if (chartFilter == "timestamp"){
      // key = key.slice(0,4)
      counts[key] = counts[prevKey] ? counts[prevKey] + 1 : 1;
      prevKey = key;
      return counts;
    }
    if (chartFilter == "daily"){
      
      key = key.slice(0,10)
      // 
    }else if (chartFilter == "weekly"){
      // const weekNum = getWeekNumber(new Date(key));
      // key = `${key.slice(0,4)}-W${weekNum}`;
      key = `${moment(key).isoWeekYear()}-W${moment(key).isoWeek()}`; ;
      // 
    }else if (chartFilter == "monthly"){
      key = key.slice(0,7)
    }else if (chartFilter == "yearly"){
      key = key.slice(0,4)
    }
    
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

  // const handleFilterChange = (event) => {
  //   const { name, value } = event.target;
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [name]: value === 'all' ? null : value,
  //   }));
  // };

  // const chartFilters = Object.keys(filters);

  const renderTooltip = (props) => (
    <BootStrapTooltip id="overlay-tooltip" {...props}>
      Count of Spaces Created Across Time, useful when trying to identify new Spaces created on a Daily/Weekly.... basis
    </BootStrapTooltip>
  );

  const tooltipContainerStyle = {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  };

  return (
    <div style={{padding:'50px'}}>
      <h4 style={{textAlign:'center'}}>Spaces Creation Over Time</h4>
      <label>
          Distribute By:
          <select style={{width:'150px',marginLeft:'12px',marginRight:'30px'}} value={chartFilter} onChange={(event) => setChartFilter(event.target.value)}>
            {attributes.map((filter) => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </label>
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
        {chartFilter=='timestamp' ? 
          <Line data={chartData} options={myOptions} /> :
          <Bar data={chartData} options={myOptions} plugins={[ChartDataLabels]} />
        }
      </div>: <p style={{padding:'100px 200px'}}>No Data</p>}  
    </div>
  );
};

export default AllSpaceChart;