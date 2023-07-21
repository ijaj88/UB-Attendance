
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { userService } from 'services';
import { useEffect,useState,useRef } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';

export function UpdateRole() {
    const roles = ["USER", "ADMIN", "PRESENTER", "ASSISTANT"];
    const [userOptions, setUserOptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectInputRef = useRef();
    const [dataUpdated, setDataUpdated] = useState(false);

    useEffect(() => {
        userService.getAllUsers()
            .then(x => {
                setUsers(x["data"]);
                setUserOptions(x["data"].map(obj => {
                    return {
                      label: obj["username"],
                      value: obj["username"]
                    };
                  }));
                setDataUpdated(false);
                setIsLoading(false);
            })
            .catch((error)=>{
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to Fetch Users. Please Refresh");
                }
            })
    }, [dataUpdated]);


    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('UBIT Name is required'),
        role: Yup.string()
            .required('Role is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState, setValue, watch } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        document.getElementById('username').value = null;
        user["roles"] = [user["role"]];
        delete user["role"];
        return userService.updateUserRole(user)
            .then(() => {
                toast.info("User Role Updated");
                selectInputRef.current.clearValue();
                setDataUpdated(true);
            }).catch((error) =>{
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("User role could not be updated. Please try Again");
                }
            })
    }

    const handleUserChange = (selectedOption) => {
        setValue('username', selectedOption?.value);
    };

    return (
        <>
        {isLoading ?  <CustomSpinner />: 
            (<><div style={{padding:'10px'}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                            
                    <div className="form-group">
                        <div className="form-group">
                            <label>UBIT Name<span>&#42;</span></label>
                            <Select
                                ref={selectInputRef}
                                className="basic-single"
                                classNamePrefix="select"
                                name="username"
                                id="username"
                                // value={this.state.value}
                                options={userOptions}
                                isClearable={true}
                                onChange={handleUserChange} 
                                // {...register('username')}
                            />
                            {/* <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div> */}
                        </div>
                        <div className="form-group">
                            <label>Change role to<span>&#42;</span></label>
                            <select name="role" {...register('role')} className={`form-control ${errors.reason ? 'is-invalid' : ''}`} >
                                <option value="" disabled selected>Select a role</option>
                                {roles.map((role, index) => (
                                    <option key={index} value={role}>{role}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{errors.role?.message}</div>
                        </div>
                    </div>

                    <div style={{textAlign:'center'}} >
                        <button className="btn btn-primary" style={{paddingLeft:'50px',paddingRight:'50px',fontSize: '15px'}}>SUBMIT</button>
                    </div>
                    
                </form>
            </div>
            <div>
                <table style={{marginTop:'40px',marginBottom:'40px'}} class="table table-striped">
                    <thead>
                        <tr>
                            <th>ADMINS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter((user) => user.roles[0] == "ADMIN").map((user) => (
                            <tr>
                                <td>
                                    {user.username}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <table style={{marginTop:'40px',marginBottom:'40px'}} class="table table-striped">
                    <thead>
                        <tr>
                            <th>ASSISTANTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter((user) => user.roles[0] == "ASSISTANT").map((user) => (
                            <tr>
                                <td>
                                    {user.username}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <table style={{marginTop:'40px',marginBottom:'40px'}} class="table table-striped">
                    <thead>
                        <tr>
                            <th>PRESENTERS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter((user) => user.roles[0] == "PRESENTER").map((user) => (
                            <tr>
                                <td>
                                    {user.username}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
            
            )
        }
        </>
    );

}