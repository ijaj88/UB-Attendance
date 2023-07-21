import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { userService } from 'services';
import Link from 'next/link'
import { toast } from 'react-toastify';

export default GeneratePassword;

function GeneratePassword() {
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('UBIT name is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return userService.initiateChangePassword(user)
            .then(() => {
                toast.info("Password reset link has been sent to your UBIT mail");
            }).catch((data)=>{
                toast.error(data?.error?.message || 'Please try again');
            })
    }

    return (
        <div style={{ display: 'flex' }}>
            <div className='tw-hidden md:tw-flex' style={{ flex: 2, backgroundColor: '#363740', height: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1 className='app-logo'>UB <br></br> Attendance <br></br> Tracker</h1>
            </div>
            <div style={{ flex: 1, padding: '50px' }}>
                <h3 className='md:tw-hidden' style={{textAlign:'center',marginBottom:'40px', color:'#363740'}}>UB Attendance Tracker</h3>
                <h4 style={{ textAlign: 'center', fontSize: '20px', marginBottom:'20px' }}>Generate Password Reset Link</h4>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>UBIT Name<span>&#42;</span></label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <br></br>
                        <div style={{ textAlign: 'center' }} >
                            <button className="btn btn-primary" style={{ paddingLeft: '25px', paddingRight: '25px', fontSize: '15px' }}>RESET PASSWORD</button>
                            <>   </>
                            <Link href={`/account/login?returnUrl=${encodeURIComponent(router.query.returnUrl || '/')}`}>Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}
