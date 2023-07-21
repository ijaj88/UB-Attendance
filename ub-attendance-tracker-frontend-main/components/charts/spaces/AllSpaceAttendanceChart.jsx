import React, { useState, useRef, useEffect } from 'react';
import { Bar,Line } from 'react-chartjs-2';
import { userService } from 'services';
import { toast } from 'react-toastify';
import randomColor from 'randomcolor';
import { Spinner } from 'react-bootstrap';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';
import SpaceBarChartPerSelection from './SpaceBarChartPerSelection';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip as BootStrapTooltip } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const AllSpaceAttendanceChart = () => {

  // const [fromDate, setFromDate] = useState(new Date().toISOString().substr(0, 10));
  // const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);

  var chartOptions = {
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
    },
    onClick: function(evt, element) {
      if (element.length > 0) {
        const label = chartData.labels[element[0].index];
        setLabelInput(label);
        let newFilters = { ...filters };
        setFilters2(newFilters);
        let newChartFilter = chartFilter;
        setChartFilter2(newChartFilter);
      }
    }
  }

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
    userService.getSpaceAttendance().then(
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
        toast.error("Unable to Fetch Data. Please Refresh!");
      }
    })
    
  }, [])

  const attributes = ["timestamp","daily","weekly","monthly","yearly"];

  // const [filters, setFilters] = useState({"department":null,"ethnicity":null,"gender":null,"level":null});
  const [filters, setFilters] = useState({"department":"All","level":"All","affiliations":"All","reason":"All"});
  const [chartFilter, setChartFilter] = useState(attributes[3]);
  const [filters2, setFilters2] = useState(null);
  const [chartFilter2, setChartFilter2] = useState(null);
  const [labelInput, setLabelInput] = useState(null);
  const [myOptions, setMyOptions] = useState(null);

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
            tooltipFormat: 'DD MMM YYYY',
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
    // chartOptions = newChartOptions;
    setMyOptions(newChartOptions);
  }, [chartFilter])

  var prevKey = null;

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
    var key = item['attendanceTimestamp']

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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const chartFilters = Object.keys(filters);
  const tooltipContainerStyle = {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  };
  const renderTooltip = (props) => (
    <BootStrapTooltip id="overlay-tooltip" {...props}>
      Total Attendance of Users for All Spaces over time. You can set Filters on Daily Basis to identify days where traffic is heavy, or identify groups attending Spaces regularly by setting Department, Levels and Affiliations filter.
    </BootStrapTooltip>
  );

  return (
    <div style={{padding:'50px'}}>
      <h4 style={{textAlign:'center'}}>Attendance over Time for all Spaces</h4>
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
        {chartFilter=='timestamp' ? 
          <Line data={chartData} options={myOptions} /> :
          <Bar data={chartData} options={myOptions} plugins={[ChartDataLabels]} />
        }
      </div>: <p style={{padding:'100px 200px'}}>No Data</p>}  
      <div>
        <SpaceBarChartPerSelection filters2 = {filters2} chartFilter2={chartFilter2} label2={labelInput}/>
      </div>
    </div>
  );
};

export default AllSpaceAttendanceChart;