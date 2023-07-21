import { useRouter } from 'next/router';
import { Controller,useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect,useState } from 'react';
import { userService } from 'services';
import  Link  from 'next/link';
import Select from 'react-select';
import { toast } from 'react-toastify';

export default ChangePassword;

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
            <label>New Password</label>
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

function ChangePassword() {
    const router = useRouter();
    const [affiliationOptions, setAffiliationOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const { username, verificationCode } = router.query;

    useEffect(() => {
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
            .required('Confirm Password is required')
    });
    
    const formOptions = { mode: 'onChange', resolver: yupResolver(validationSchema) };
    const { control, register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return userService.changePassword({"username":username,"Newpassword":user["password"], "token":verificationCode})
            .then(() => {
                toast.info("Password Updated");
                router.push("/account/login");
            }).catch((data) =>{
                
                toast.error(data.error.message);
            })
    }

    return (
        <div style={{display : 'flex'}}>
            <div className='tw-hidden md:tw-flex' style={{flex:2,backgroundColor: '#363740',minHeight: "120vh",height: "auto", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <h1 className='app-logo'>UB <br></br> Attendance <br></br> Tracker</h1>
            </div>
            <div style={{flex:1,padding:'50px'}}>
            <h3 className='md:tw-hidden' style={{textAlign:'center',marginBottom:'40px', color:'#363740'}}>UB Attendance Tracker</h3>
                <h4 style={{textAlign:'center',fontSize: '20px', marginBottom:'20px'}}>Change Your Password</h4>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        
                        <PasswordInput
                            // value={password}
                            onChange={handlePasswordChange}
                            requirements={passwordRequirements}
                            inputRef={register}
                            errors={errors}
                        />
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input name="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                        </div>

                        <div style={{ textAlign: 'center' }} >
                            <button className="btn btn-primary" style={{ paddingLeft: '50px', paddingRight: '50px', fontSize: '15px' }}>CHANGE PASSWORD</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
