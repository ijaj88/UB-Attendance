import { useRouter } from 'next/router';
import { Controller,useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect,useState } from 'react';
import { userService } from 'services';
import  Link  from 'next/link';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useRouteHandler  } from 'helpers/utils';

export default Register;

function PasswordRequirements({ requirements }) {
    return (
      <ul style={{listStyle:'none',marginTop:'20px',padding:0}}>
        {requirements.map((requirement) => (
          <li key={requirement.message}>
            <span>
              {requirement.isMet ? '✅ ' : '❌ '}
            </span>
            {requirement.message}
          </li>
        ))}
      </ul>
    );
  }

function PasswordInput({ onChange, requirements, inputRef, errors }) {
    const handleChange = (event) => {
        
        onChange(event.target.value);
    };
  
    return (
      <>
        <div className="form-group">
            <label>Password<span>&#42;</span></label>
            <input
                name="password"
                type="password"
                {...inputRef("password",{
                    onChange: handleChange
                  })}
                className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
            />
            <PasswordRequirements requirements={requirements} />
        </div>        
      </>
    );
  }

function Register() {
    const router = useRouter();
    const [affiliationOptions, setAffiliationOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    // const handleRouteChange = useRouteHandler();

    useEffect(() => {
        if (userService.userValue) {
            // handleRouteChange()
            router.push("/myProfile")
        }
        async function fetchAffiliations() {
            userService.getAffiliations()
            .then((x) => {
                
                setAffiliationOptions(x["data"].map(obj => {
                    return {
                      label: obj["name"],
                      value: obj["id"]
                    };
                  }));
            })
          }
          fetchAffiliations();
    }, []);

    const [passwordRequirements, setPasswordRequirements] = useState([
        { message: 'Requires an uppercase character', isMet: false, regex: /^(?=.*[A-Z])/ },
        { message: 'Requires a special character', isMet: false, regex: /^(?=.*[!@#$%^&*])/ },
        { message: 'Requires at least 8 characters', isMet: false, regex: /^.{8,}$/ },
    ]);

    const handlePasswordChange = (value) => {
        setPasswordRequirements(passwordRequirements.map((requirement) => ({
          ...requirement,
          isMet: requirement.regex.test(value),
        })));
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('UBIT name is required'),
        // .email('Please enter a valid email address')
        // .matches(/@buffalo.edu$/, {message: 'Should be valid UB mail'}),
        password: Yup.string()
            .required('Password is required')
            .test('complexity', 'Must Contain atleast 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character', (value) => {
                const passwordRequirements = [
                  { regex: /(?=.*[A-Z])/g, message: 'One uppercase character' },
                  { regex: /(?=.*[@$!%*#?&])/g, message: 'One special character' },
                  { regex: /.{8,}/g, message: 'At least 8 characters' },
                ];
          
                const unmetRequirements = passwordRequirements.filter(({ regex }) => !regex.test(value));
                return unmetRequirements.length === 0;
            }),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
        affilations: Yup.array().of(Yup.number())
    });
    const formOptions = { mode: 'onChange', resolver: yupResolver(validationSchema) };

    const { control, register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return userService.register(user)
            .then(() => {
                toast.info("Verification link has been sent to your UBIT email");
                // router.push({
                //     pathname: '/account/login',
                //     query: { returnUrl: router.query.returnUrl || '/'}
                // });
            }).catch((data) =>{
                if (data?.name != 'AbortError' && data?.name != 'TimeoutError'){
                    toast.error(data.error.message);
                }
                
            })
    }

    return (
        <div style={{display : 'flex'}}>
            <div className='tw-hidden md:tw-flex' style={{flex:2,backgroundColor: '#363740',minHeight: "120vh",height: "auto", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <h1 className='app-logo'>UB <br></br> Attendance <br></br> Tracker</h1>
            </div>
            <div style={{flex:1,padding:'50px'}}>
                <h3 className='md:tw-hidden' style={{textAlign:'center',marginBottom:'40px', color:'#363740'}}>UB Attendance Tracker</h3>
                <h4 style={{textAlign:'center',fontSize: '20px',marginBottom:'20px'}}>Create your account</h4>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>UBIT Name<span>&#42;</span></label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        {/* <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div> */}
                        <PasswordInput
                            // value={password}
                            onChange={handlePasswordChange}
                            requirements={passwordRequirements}
                            inputRef={register}
                            errors={errors}
                        />
                        <div className="form-group">
                            <label>Confirm Password<span>&#42;</span></label>
                            <input name="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                        </div>


                        <Controller
                            name="affilations"
                            control={control}
                            render={({ field: { onChange, value, name } }) => (
                            <div className="form-group">
                                <label>Select your Affiliations If Any</label>
                                <Select
                                name={name}
                                value={affiliationOptions.filter((option) => value && value.includes(option.value))}
                                onChange={(selected) => {
                                    const selectedValues = selected ? selected.map((option) => option.value) : [];
                                    onChange(selectedValues);
                                }}
                                isMulti
                                options={affiliationOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                />
                                {errors.affilations && (
                                <div className="invalid-feedback">{errors.affilations.message}</div>
                                )}
                            </div>
                            )}
                        />
                        
                        {/* <div className="form-group">
                            <label>Select your Affiliations If Any</label>
                            <Select
                                value={selected}
                                onChange={(selected) => {
                                    setSelected(selected);
                                }}
                                isMulti
                                options={affiliationOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                            {errors.affiliations && (
                                <div className="invalid-feedback">{errors.affiliations.message}</div>
                            )}
                        </div> */}

                        <div style={{ textAlign: 'center' }} >
                            <button className="btn btn-primary" style={{ paddingLeft: '50px', paddingRight: '50px', fontSize: '15px' }}>Register</button>
                            <>   </>
                            <Link href={`/account/login?returnUrl=${encodeURIComponent(router.query.returnUrl || '/')}`}>Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
