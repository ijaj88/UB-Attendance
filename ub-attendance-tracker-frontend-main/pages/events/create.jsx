import { Controller,useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { userService } from 'services';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Select from 'react-select';
import CustomSpinner from 'components/CustomSpinner';

export default createEvent;

function createEvent({userRoleValue}) {

    const [spaceData, setSpaceData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [newSeries, setNewSeries] = useState(null);
    const [newSeriesAdded, setNewSeriesAdded] = useState(true);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (userRoleValue === undefined){
            return;
        }
        if(["ADMIN","ASSISTANT"].includes(userRoleValue)){
            setLoading(false);
            setNewSeriesAdded(false);
            userService.getSpaces()
                .then(x => {
                    setSpaceData(x["data"]);
                })
                .catch((error)=>{
                    if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                        toast.error("Unable to fetch spaces. Please refresh!");
                    }
                })
        }else{
            router.push('/404');
        }
    }, []);

    useEffect(() => {
        if (loading){
            return;
        }
        userService.getSeries()
            .then(x => {
                setSeriesData(x["data"].map((series) => ({
                    label: series.name,
                    value: series.id
                })));
                setNewSeriesAdded(false);
            })
            .catch((error)=>{
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch series. Please refresh!");
                }
            })
    }, [newSeriesAdded]);

    const createEventValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        // dateField: Yup.date()
        //    .required('Date is required'),
        to: Yup.string()
            .required('Required'),
        from: Yup.string()
            // .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
            .required('Required'),
        description: Yup.string()
            .required('Description is required'),
        // organizedBy: Yup.string()
        //    .required('Presenter Email is required'),
        // categoryId: Yup.string(),
        series: Yup.number().nullable(true),
        spacesId: Yup.number().nullable(true).transform((_, val) => {
            if (val == 0){
                return null;
            }else{
                return Number(val);
            }
        })
        
    });

    const formOptions = { resolver: yupResolver(createEventValidationSchema) };
    const { control, register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function handleCreateSeries() {
        return userService.createSeries({"name":newSeries})
            .then(() => {
                setNewSeriesAdded(true);
                setNewSeries('');
                toast.info("Series Created");
            }).catch((error) =>{
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Series Creation Failed. Please try Again");
                }
            })
    }

    function onSubmit(user) {
        user.from = user.from + ':00Z';
        user.to = user.to + ':00Z'; 

        return userService.createEvent(user)
            .then(() => {
                toast.info("Event Created");
                router.push('/events');
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Event Creation Failed. Please try Again");
                }
            })
    }

    const handleInputChange = (event) => {
        setNewSeries(event.target.value);
    };

    function handleFromChange(event) {
        const fromValue = event.target.value;
        const toInput = document.getElementById('to');
        if (toInput) {
          toInput.value = fromValue;
        }
      }
    

    return (
        <>
        {loading ?  <CustomSpinner />: 
            (
                <>
                    <div style={{ padding: '10px' }}>
                        <h4 style={{ fontSize: '18px' }}>Add New Series</h4>
                        <div style={{ borderTop: '1px solid #808080', paddingTop: '20px' }} >
                            <div className="row">
                                <div class="col-3"> 
                                    <input type="text" className="form-control" placeholder="Type Name" value={newSeries} onChange={handleInputChange} />
                                </div>
                                <div class="col-1" style={{textAlign:'center'}}>
                                    <button type="button" className="btn btn-primary" style={{paddingLeft:'10px',paddingRight:'10x'}} onClick={handleCreateSeries}>CREATE</button>
                                </div>
                            </div>

                        </div>
                        <h4 style={{ fontSize: '18px',paddingTop:'40px' }}>Create New Event</h4>
                        <div style={{ borderTop: '1px solid #808080', paddingTop: '20px' }} >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group" style={{width: '400px'}}>
                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        Attach to any Space
                                        <div></div>
                                    </label>
                                    <select name="spacesId" 
                                        {...register('spacesId')}  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        
                                    >
                                            <option value={0}>Select Space</option>
                                            {spaceData?.map(space => (
                                                <option key={space.id} value={space.id}>{space.title}</option>
                                            ))}
                                    </select>
                                    {errors.spacesId && (
                                        <div className="invalid-feedback">{errors.spacesId.message}</div>
                                    )}
                                </div>
                                <Controller
                                    name="series"
                                    control={control}
                                    render={({ field: { onChange, value, name } }) => (
                                    <div className="form-group" style={{width: '400px'}}>
                                        <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Attach to any series</label>
                                        <Select
                                            name={name}
                                            isClearable={true}
                                            value={seriesData.find((option) => option.value === value)}
                                            onChange={(selected) => {
                                                onChange(selected ? selected.value : null);
                                            }}
                                            options={seriesData}
                                            classNamePrefix="select"
                                            
                                        />
                                        {errors.series && (
                                        <div className="invalid-feedback">{errors.series.message}</div>
                                        )}
                                    </div>
                                    )}
                                />
                                <div className="form-group" style={{width: '700px'}}>
                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        Title<span>&#42;</span>
                                        <div></div>
                                    </label>
                                    <textarea id="title" name="title" {...register('title')} rows="1" cols="100" className={`form-control ${errors.title ? 'is-invalid' : ''}`}></textarea>
                                </div>
                                <br />
                                <div className="form-group" style={{width: '1200px'}}>
                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        Description<span>&#42;</span>
                                        <div></div>
                                    </label>
                                    <textarea id="description" name="description" {...register('description')} rows="5" cols="100" className={`form-control ${errors.description ? 'is-invalid' : ''}`}></textarea>
                                </div>
                                
                                <div style={{'display':'flex'}}>
                                    <div className="form-group" style={{width: '400px'}}>
                                        <div style={{ flex: 1,  marginRight: '10px' }}>
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }}>From<span>&#42;</span></label>
                                            <br />
                                            <input type="datetime-local" name="from" {...register('from')} id="from" className={`form-control ${errors.from ? 'is-invalid' : ''}`} onChange={handleFromChange} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{width: '400px'}}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }}>To<span>&#42;</span></label>
                                            <br />
                                            <input type="datetime-local" name="to" {...register('to')} id="to" className={`form-control ${errors.to ? 'is-invalid' : ''}`} />
                                        </div>
                                        <div>{errors.to?.message}</div>
                                    </div>
                                </div>
                                
                                {/* <div className="form-group" style={{width: '400px'}}>
                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Presenter<span>&#42;</span></label>
                                    <div></div>
                                    <input name="organizedBy" type="email"
                                        {...register('organizedBy')}
                                        className={`form-control ${errors.organizedBy ? 'is-invalid' : ''}`} />
                                </div> */}
                                <br />
                                <div style={{ paddingBottom: '30px' }}>
                                    <button className="btn btn-primary" style={{ paddingLeft: '20px', paddingRight: '20px', fontSize: '15px' }}>Create Event</button>
                                </div>                            
                            </form>


                        </div>
                        
                            
                    </div>
                </>)
        }
        </>
    )
};

