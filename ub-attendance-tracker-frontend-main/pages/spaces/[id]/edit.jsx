import { userService } from 'services';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export default EditEvent;

function EditEvent() {
    const [space, setSpace] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!id){
            return;
        }
        userService.getSpaceById(id)
            .then(x => {
                setSpace(x)
                setLoading(false);
            })
            .catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch space. Please refresh!");
                }
            })
    }, [id]);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        // isActive: Yup.boolean()
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return userService.updateSpace(user,id)
            .then(() => {
                toast.info("Space Updated");
                router.push("/spaces");
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to update space. Please try again!");
                }
            })
    }

    return (
        <>
            {!loading ? 
                <>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label>Title<span>&#42;</span></label>
                                <input name="title" type="text" defaultValue={space.data.title} {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.title?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Description<span>&#42;</span></label>
                                <textarea name="description" rows="6" defaultValue={space.data.description} {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.description?.message}</div>
                            </div>
                            {/* <div className="form-group">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="isActive" {...register('isActive')} defaultChecked={space.data.isActive} />
                                    <label className="form-check-label" htmlFor="isActive">Active</label>
                                </div>
                            </div> */}
                            <br></br>
                            <button className="btn btn-primary" style={{paddingLeft:'40px',paddingRight:'40px',fontSize: '15px'}}>SAVE</button>             
                        
                        </form>
                    </div>
                </> : 
            <CustomSpinner />}
        </>
    );
}