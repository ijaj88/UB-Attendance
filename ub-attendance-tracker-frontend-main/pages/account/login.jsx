import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { userService } from 'services';
import { useRouteHandler  } from 'helpers/utils';
import Link from 'next/link'
import { toast } from 'react-toastify';

export default Login;

function Login() {
    const router = useRouter();
    // const handleRouteChange = useRouteHandler();
    useEffect(() => {
        if (userService.userValue) {
            // handleRouteChange();
            router.push('/myProfile')
        }
    }, []);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('UBIT name is required'),
        // .email('Please enter a valid email address')
        // .matches(/@buffalo.edu$/, {message: 'Should be valid UB mail'}),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ username, password }) {
        return userService.login(username, password)
            .then(() => {
                
                // userService.getUserProfile();
                var returnUrl = router.query.returnUrl || '/myProfile';
                if (returnUrl === '/'){
                    returnUrl = '/myProfile'
                }

                router.push(returnUrl);
                
            }).catch(error =>{
                if (error?.error?.statusCode == 401){
                    toast.error("Incorrect Credentials!");
                }else if (error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Login Failed. Please try again");
                }
            })
    }

    return (
        <div style={{ display: 'flex' }}>
            <div className='tw-hidden md:tw-flex' style={{ flex: 2, backgroundColor: '#363740', height: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1 className='app-logo'>UB <br></br> Attendance <br></br> Tracker</h1>
            </div>
            <div style={{ flex: 1, padding: '50px' }}>
                <h3 className='md:tw-hidden' style={{textAlign:'center',marginBottom:'40px', color:'#363740'}}>UB Attendance Tracker</h3>
                <h4 style={{ textAlign: 'center', fontSize: '20px',marginBottom:'20px'}}>Login into your account</h4>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>UBIT Name<span>&#42;</span></label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password<span>&#42;</span></label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                            <div style={{textAlign:'right',padding:'7px',fontSize:'17px'}}>
                                <Link  href={`/account/generatePassword?returnUrl=${encodeURIComponent(router.query.returnUrl || '/')}`}> Forgot Password?</Link>
                            </div>
                        </div>
                        <br></br>
                        <div style={{ textAlign: 'center' }} >
                            <button className="btn btn-primary" style={{ paddingLeft: '50px', paddingRight: '50px', fontSize: '15px' }}>LOGIN</button>
                        </div>
                    </form>
                    <br></br>
                    <div style={{ textAlign: 'center' }}>
                        <p> Don't have an account yet?
                            <Link href={`/account/register?returnUrl=${encodeURIComponent(router.query.returnUrl || '/')}`}> Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}
