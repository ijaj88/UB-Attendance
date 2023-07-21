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
import FilteredEvents from './FilteredEvents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip as BootStrapTooltip } from 'react-bootstrap';

ChartJS.register(
    ArcElement, Tooltip, Legend
);
const formatDate = (isoString) => {
  // Check if the input is already a valid date in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(isoString)) {
    return isoString;
  }

  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EventPieDistribution = ({eventInfo, seriesInfo}) => {
  if(!eventInfo && !seriesInfo){
    return;
  }
  const [fromDate, setFromDate] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);

  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!eventInfo && !seriesInfo){
      return;
    }else if(eventInfo){
      
      setLoading(true);
      if (fromDate === null){
        setFromDate(eventInfo["createdAt"].substr(0, 10));
      }
      userService.getEventAttendanceWithId(eventInfo["value"],fromDate,toDate).then(
        (output) =>{
          setData(output.data);
          setLoading(false);
        }
      ).catch((error) => {
        setLoading(false);
        if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
          toast.error("Unable to Fetch Data. Please Refresh");
        }
      })
    }else if(seriesInfo){
      
      setLoading(true);
      if (fromDate === null){
        setFromDate(seriesInfo["createdAt"].substr(0, 10));
      }
      
      userService.getEventAttendanceWithSeriesId(seriesInfo["value"],fromDate,toDate).then(
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
    }
    
    
  }, [eventInfo,seriesInfo,fromDate,toDate])


  // const attributes = ["department","ethnicity","gender","level","affiliations"];
  const attributes = ["department","level","affiliations"];
  
  const initialFilters = {};
  attributes.forEach(attribute => {
    initialFilters[attribute] = "All";
  });

  const [filters, setFilters] = useState(initialFilters);
  const [filters2, setFilters2] = useState(initialFilters);
  const [chartFilter, setChartFilter] = useState(attributes[0]);

  const chartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
          const percentage = Math.round((value / total) * 100) + '%';
          return `${value} (${percentage})`;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 13
        }
      },
      legend: {
        position: 'right',
      },
      title: {
        display: false,
        text: 'Attendance Distribution'
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    onClick: function(evt, element) {
      if (element.length > 0) {
        const label = chartData.labels[element[0].index];
        let newFilters = { ...filters };
        newFilters[chartFilter] = label;
        setFilters2(newFilters);
      }
    }
  };

  const barChartOptions = {
    plugins: {
      datalabels: {
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
      },
      legend: {
        position: 'right',
      },
      title: {
        display: false,
        text: 'Attendance Distribution'
      }
    },
    maintainAspectRatio: true,
    responsive: true,
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
        let newFilters = { ...filters };
        newFilters[chartFilter] = label;
        setFilters2(newFilters);
      }
    }
  };

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
    
    const value = item[chartFilter];
    if (chartFilter == "affiliations"){
      if (value === null){
        counts[value] = counts[value] ? counts[value] + 1 : 1;
      }else{
        value?.split(", ").forEach((eachAffiliaton)=>{
          counts[eachAffiliaton] = counts[eachAffiliaton] ? counts[eachAffiliaton] + 1 : 1;
        })
      }
      
    } else {
      counts[value] = counts[value] ? counts[value] + 1 : 1;
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

  const handleDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const tooltipContainerStyle = {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  };

  const renderTooltip = (props) => (
    <BootStrapTooltip id="overlay-tooltip" {...props}>
      For the selected Event this graph displays the User Attendance based upon their Department, Affiliation and Level of Education.
    </BootStrapTooltip>
  );

  const chartFilters = Object.keys(filters);

  return (
    <>
    <div style={{padding:'50px'}}>
      <h4 style={{textAlign:'center'}}>Demographic Distribution</h4>
      <label>
          Distribute By:
          <select style={{width:'150px',marginLeft:'12px',marginRight:'30px'}} value={chartFilter} onChange={(event) => setChartFilter(event.target.value)}>
            {chartFilters.map((filter) => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </label>
      {/* <label>
        From:
        <input style={{width:'150px',marginLeft:'12px',marginRight:'30px'}} type="date" id="from" name="from" value={formatDate(fromDate)}
          onChange={handleDateChange}></input>
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
          <div className='col-5'>
            <div style={{ position: 'relative' }}>
              <div style={tooltipContainerStyle}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <div>
                    <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
                  </div>
                </OverlayTrigger>
              </div>

              {Object.values(countData).some(value => value !== 0) ? (
                <div style={{ width: '500px', height: '500px' }}>
                  {chartFilter == 'affiliations' ? (
                    <Bar data={chartData} options={barChartOptions} plugins={[ChartDataLabels]} />
                  ) : (
                    <Pie data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                  )}
                </div>
              ) : (
                <p style={{ padding: '100px 200px' }}>No Data</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <FilteredEvents filters={filters2} />
        </div>
      </div>
    </>
  );
};

export default EventPieDistribution;