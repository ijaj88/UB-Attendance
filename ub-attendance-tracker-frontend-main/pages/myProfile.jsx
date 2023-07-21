import { useRouter } from 'next/router';
import { Controller,useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { userService } from 'services';
import { ReasonList } from 'components';
import { useState, useEffect } from 'react';
import { TagList } from '../components/manage/ReasonList';
import { toast } from 'react-toastify';
import Select from 'react-select';
import CustomSpinner from 'components/CustomSpinner';
export default MyProfile;

function MyProfile(){
    const router = useRouter();
    const [user, setUser] = useState({data: {email: ''}});
    const [editable, setEditable] = useState(false);
    const [affiliationOptions, setAffiliationOptions] = useState([]);
    const [userAffiliations, setUserAffiliations] = useState([]);
    const [selectValue, setSelectValue] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const handleEditClick = () => {
        setEditable(true);
    }

    useEffect(() => {
        userService.getUserProfile()
            .then(x => {
                setUser(x);
                var userAffiliations = x.data["affilation"].map(obj => {
                    return {
                        label: obj["name"],
                        value: obj["id"]
                    };
                })
                setUserAffiliations(userAffiliations);
                setLoading(false);
                userService.getAffiliations()
                    .then((x) => {
                        
                        var affiliationOptions = x["data"].map(obj => {
                            return {
                                label: obj["name"],
                                value: obj["id"]
                            };
                        })

                        userAffiliations.forEach((affiliation) => {
                            const existingOption = affiliationOptions.find((option) => option.value === affiliation.value);
                            if (!existingOption) {
                                affiliationOptions.push(affiliation);
                            }
                        });
                        
                        

                        setAffiliationOptions(affiliationOptions);
                }).catch((error)=>{
                    if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                        toast.error("Unable to Fetch Data. Please Refresh!");
                    }
                })
            })
            .catch((error)=>{
                
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to Fetch Data. Please Refresh!");
                }
            })
    }, []);

    const editProfileValidationSchema = Yup.object().shape({
        affilations: Yup.array().of(Yup.number())
    });
    const editProfileFormOptions = { resolver: yupResolver(editProfileValidationSchema) };

    const { control,register:editProfile, handleSubmit:editProfileHandle, formState:editProfileFormState } = useForm(editProfileFormOptions);
    const { errors: editProfileErrors } = editProfileFormState;

    function onEditProfile(user) {
        return userService.editAffiliations(user)
            .then(() => {
                toast.info("Update Sucessfull!");
                router.push('/myProfile');
            }).catch((error) =>{
                
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to update Affiliations. Please try again!");
                }
            })
    }

    const onCancel = () => {
        setEditable(false);
        setSelectValue(null);
    }

    function resetPassword(){
        return userService.initiateChangePassword({"username":user.data.username})
            .then(() => {
                toast.info("Password reset link has been sent to your UBIT mail");
            }).catch((data)=>{
                toast.error(data.error.message);
            })
    }

    return (
        <>
            {loading ? <CustomSpinner /> :
                (<><div style={{padding:'10px'}}>
                    <h4 style={{fontSize: '18px'}}>My Information</h4>
                    <div style={{borderTop:'1px solid #808080',paddingTop:'20px'}}>
                        <form onSubmit={editProfileHandle(onEditProfile)}>
                            <div style={{width:'400px'}}>
                                <div className="form-group">
                                    <label style={{fontWeight:'bold',fontSize:'20px'}}>Email</label>
                                    <div style={{paddingTop:'2px',paddingBottom:'11px'}}>{user.data.email ? user.data.email : '-'}</div>
                                </div>
                                <Controller
                                    name="affilations"
                                    control={control}
                                    render={({ field: { onChange, value, name } }) => (
                                    <div className="form-group">
                                        <label>Your Affiliations</label>
                                        <Select
                                            name={name}
                                            value={selectValue ? affiliationOptions.filter(option => value.includes(option.value)) : userAffiliations}
                                            onChange={(selected) => {
                                                const selectedValues = selected ? selected.map((option) => option.value) : [];
                                                setSelectValue(selectedValues);
                                                onChange(selectedValues);
                                            }}
                                            isMulti
                                            options={affiliationOptions}
                                            isDisabled={!editable}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                    </div>
                                    )}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-sm-12' style={{textAlign:'right'}}>
                                    {editable ? (
                                        <>
                                            <button type="button" className="btn btn-danger" onClick={onCancel} style={{ margin: '20px', paddingLeft: '50px', paddingRight: '50px', fontSize: '15px' }}>CANCEL</button>
                                            <button className="btn btn-primary" style={{ paddingLeft: '50px', paddingRight: '50px', fontSize: '15px' }}>SAVE</button>
                                        </>
                                    ) : (
                                        <button type="button" className="btn btn-primary" onClick={handleEditClick} style={{ paddingLeft: '50px', paddingRight: '50px', fontSize: '15px' }}>EDIT</button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    
                </div>
                
            
                <div style={{marginTop:'40px',padding:'10px'}}>
                    <h4 style={{fontSize: '18px'}}>Change your password</h4>
                    <div style={{borderTop:'1px solid #808080',paddingTop:'20px'}}>
                        <a type="btn" onClick={resetPassword} style={{color: 'blue', textDecoration: 'underline'}}>Click here to receive a password reset link</a>
                    </div>
                </div></>)
            }
        </>
    );
}


