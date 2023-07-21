import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { userService } from 'services';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export default createSpace;

function createSpace({userRoleValue}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    useEffect(() => {
        if (userRoleValue === undefined){
            return;
        }
        if(["ADMIN","ASSISTANT"].includes(userRoleValue)){
            setLoading(false);
        }else{
            router.push('/404');
        }  
    }, []);

    function onSubmit(user) {
        return userService.createSpace(user)
            .then(() => {
                toast.info("Space Created");
                router.push("/spaces");
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Space Creation Failed. Please try Again");
                }
            })
    }

    return (
        <>
        {loading ?  <CustomSpinner />: 
            (<>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Title<span>&#42;</span></label>
                            <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Description<span>&#42;</span></label>
                            <textarea name="description" rows="6" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.description?.message}</div>
                        </div>
                        <br></br>
                        <button className="btn btn-primary" style={{paddingLeft:'40px',paddingRight:'40px',fontSize: '15px'}}>CREATE</button>             
                    
                    </form>
                </div>
            </>)
        }
        </>   
    );
}
