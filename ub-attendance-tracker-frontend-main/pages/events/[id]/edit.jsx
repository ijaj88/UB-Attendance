import { userService } from 'services';
import { useState, useEffect,useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Switch from "react-switch";
import { toast } from 'react-toastify';
import Select from 'react-select';
import CustomSpinner from 'components/CustomSpinner';

export default EditEvent;

function EditEvent() {
    const [event, setEvent] = useState(null);
    const router = useRouter();
    const [spaceData, setSpaceData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [newSeries, setNewSeries] = useState(null);
    const [newSeriesAdded, setNewSeriesAdded] = useState(false);
    const [loading, setLoading] = useState(true);
    const selectInputRef = useRef();

    const editEventValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        // dateField: Yup.date()
        //    .required('Date is required'),
        to: Yup.string()
            // .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
            .required('Required'),
        from: Yup.string()
            // .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
            .required('Required'),
        description: Yup.string()
            .required('Description is required'),
        // organizedBy: Yup.string()
        //    .required('Presenter Email is required'),
        series: Yup.number().nullable(true),
        spacesId: Yup.number().nullable(true).transform((_, val) => {
            if (val == 0){
                return null;
            }else{
                return Number(val);
            }
        })
    });

    const formOptions = { resolver: yupResolver(editEventValidationSchema) };
    const { control, register, handleSubmit, formState, setValue } = useForm(formOptions);
    const { errors } = formState;
    const { id } = router.query;
    
    useEffect(() => {
        if (!id){
            return;
        }
        userService.getSpaces()
            .then(x => {
                
                setSpaceData(x["data"]);

                userService.getSeries()
                    .then(x => {
                        setSeriesData(x["data"].map((series) => ({
                            label: series.name,
                            value: series.id
                        })));
                        userService.getEventById(id)
                            .then(x => {
                                setEvent(x);
                                
                                setValue('spacesId', x["data"].spaces?.id);
                                setValue('series', x["data"].series?.id);
                                setLoading(false);
                            })
                            .catch((error) => {
                                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                                    toast.error("Unable to fetch event. Please refresh!");
                                }
                            });
                    })
                    .catch((error) => {
                        if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                            toast.error("Unable to fetch series. Please refresh!");
                        }
                    })
            })
            .catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch spaces. Please refresh!");
                }
            })
        
        }, [id]);

    useEffect(() => {
        userService.getSeries()
            .then(x => {
                setSeriesData(x["data"].map((series) => ({
                    label: series.name,
                    value: series.id
                })));
                setNewSeriesAdded(false);
            })
            .catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch series. Please refresh!");
                }
            })
    }, [newSeriesAdded]);

    function handleCreateSeries() {
        return userService.createSeries({"name":newSeries})
            .then(() => {
                setNewSeriesAdded(true);
                setNewSeries('');
                toast.info("Series Created");
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Error in creating Series. Please try again!");
                }
            })
    }

    function toISODateTime(localDateTime) {
        const dateTime = new Date(localDateTime);
        const isoDateTime = dateTime.toISOString();
        return isoDateTime;
    }

    function onSubmit(user) {
        user.from = user.from + ':00Z';
        user.to = user.to + ':00Z';

        return userService.updateEvent(user, id)
            .then(() => {
                toast.info("Event Updated");
                router.push("/events");
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to update event. Please try again!");
                }
            });
    }

    const handleInputChange = (event) => {
        setNewSeries(event.target.value);
    };
    
    const handleSeriesChange = (selectedOption) => {
        
        // selectInputRef.current.clearValue();
        setValue('series', selectedOption?.value);
    };

    return (
        <>
            {event ?
                    
                        (<div style={{ padding: '10px' }}>
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
                            <h4 style={{ fontSize: '18px',paddingTop:'40px' }}>Event Information</h4>
                            <div style={{ borderTop: '1px solid #808080', paddingTop: '20px' }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    
                                            <div className="form-group" style={{width: '400px'}}>
                                                <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                                    Attach to any Space
                                                </label>
                                                <select name="spacesId" 
                                                    {...register('spacesId')} className={`form-control ${errors.spacesId ? 'is-invalid' : ''}`}
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
                                                        // ref={selectInputRef}
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
                                                <textarea id="title" name="title" defaultValue={event.data.title} {...register('title')} rows="1" cols="100" className={`form-control ${errors.title ? 'is-invalid' : ''}`}></textarea>
                                            </div>
                                            <br />
                                            <div className="form-group" style={{width: '1200px'}}>
                                                <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                                    Description<span>&#42;</span>
                                                    <div></div>
                                                </label>
                                                <textarea id="description" name="description" defaultValue={event.data.description} {...register('description')} rows="5" cols="100" className={`form-control ${errors.description ? 'is-invalid' : ''}`}></textarea>
                                            </div>
                                            <br />
                                            <div style={{'display':'flex'}}>
                                                <div className="form-group" style={{width: '400px'}}>
                                                    
                                                        <div style={{ flex: 1, marginRight: '10px' }}>
                                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }}>From<span>&#42;</span></label>
                                                            <br />
                                                            <Controller
                                                                name="from"
                                                                control={control}
                                                                defaultValue={new Date(event.data.from).toISOString().slice(0, -8)}
                                                                render={({ field }) => (
                                                                    <input
                                                                        type="datetime-local"
                                                                        {...field}
                                                                        className={`form-control ${errors.from ? 'is-invalid' : ''}`}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                </div>
                                                <div className="form-group" style={{width: '400px'}}>
                                                        <div style={{ flex: 1 }}>
                                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }}>To<span>&#42;</span></label>
                                                            <br />
                                                            <Controller
                                                                name="to"
                                                                control={control}
                                                                defaultValue={new Date(event.data.to).toISOString().slice(0, -8)}
                                                                render={({ field }) => (
                                                                    <input
                                                                        type="datetime-local"
                                                                        {...field}
                                                                        className={`form-control ${errors.to ? 'is-invalid' : ''}`}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                </div>
                                                
                                            </div>
                                            <br />
                                            {/* <div className="form-group" style={{width: '400px'}}>
                                                <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Presenter</label>
                                                <div></div>
                                                <input name="organizedBy" type="text"
                                                    {...register('organizedBy')}
                                                    defaultValue={event.data.organizedBy}
                                                    className={`form-control ${errors.organizedBy ? 'is-invalid' : ''}`} />
                                            </div>
                                            <br /> */}
                                            <div style={{ paddingBottom: '30px' }}>
                                                <button className="btn btn-primary" style={{ paddingLeft: '20px', paddingRight: '20px', fontSize: '15px' }}>SAVE</button>
                                            </div>
                                        
                                        
                                            
                                            {/* <div>
                                                <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Add New Series</label>
                                                <div className="row">
                                                    <div class="col-8"> 
                                                        <input type="text" className="form-control" placeholder="Type Name" value={newSeries} onChange={handleInputChange} />
                                                    </div>
                                                    <div class="col-1">
                                                        <button type="button" className="btn btn-primary" style={{paddingLeft:'10px',paddingRight:'10x'}} onClick={handleCreateSeries}>CREATE</button>
                                                    </div>
                                                </div>
                                            </div> */}
                                        
                                    
                                </form>
                            </div>
                        </div>)
                    : <CustomSpinner />}
        </>
    );
}