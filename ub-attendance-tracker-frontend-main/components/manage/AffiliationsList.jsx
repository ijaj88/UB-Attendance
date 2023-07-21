import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { userService } from 'services';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';
import { confirmAlert } from 'react-confirm-alert'; // Import

export function AffiliationsList() {
    const [affiliationsList, setAffiliationsList] = useState([]);
    const [newAffiliations, setNewAffiliations] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        userService.getAffiliations()
            .then((x) => {
                
                setAffiliationsList(x.data);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Unable to fetch Affiliations. Please refresh!");
                }
            });
    }, []);

    const handleInputChange = (event) => {
        setNewAffiliations(event.target.value);
    };

    function handleAddTag() {
        return userService.addAffiliations({ "name": newAffiliations })
            .then((output) => {
                setAffiliationsList([...affiliationsList, output]);
                setNewAffiliations('');
                toast.info("Affiliation Added");
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Affiliation Creation Failed. Please try Again");
                }
            });
    }

    function handleDeleteTag(id,name) {
        confirmAlert({
            message: 'Are you sure you want to delete this affiliation?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    return userService.editAffiliation(id, {"name":name,"isActive":false})
                    .then((output) => {
                        setAffiliationsList(affiliationsList => affiliationsList.filter(affiliation => affiliation.id != id));
                        toast.info("Affiliation Deleted");
                    }).catch((error) => {
                        if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                            toast.error("Affiliation Deletion Failed. Please try Again");
                        }
                    });
                }
              },
              {
                label: 'No',
                onClick: () => { }
              }
            ],
            closeOnClickOutside: false,
          });
    }

    function handleEditTag(id, newAffiliationsValue) {
        return userService.editAffiliation(id, { "name": newAffiliationsValue })
            .then((output) => {
                const index = affiliationsList.findIndex(obj => obj.id === id);
                const updatedList = [...affiliationsList];
                updatedList[index] = output.data;
                setAffiliationsList(updatedList);
                toast.info("Affiliation Updated");
            }).catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                    toast.error("Affiliation Update Failed. Please try Again");
                }
            });
    }

    return (
        <>
            {!isLoading ?
                (<>
                    <div className="row">
                        <div class="col-10">
                            <input type="text" className="form-control" placeholder="Type Affiliations" value={newAffiliations} onChange={handleInputChange} />
                        </div>
                        <div class="col-2" style={{ textAlign: 'center' }}>
                            <button className="btn btn-primary" onClick={handleAddTag}>Add Affiliation</button>
                        </div>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        {affiliationsList.map(({ id, name }) => (
                            <Affiliations
                                key={name}
                                value={name}
                                onDelete={() => handleDeleteTag(id,name)}
                                onEdit={(newAffiliationsValue) => handleEditTag(id, newAffiliationsValue)}
                            />
                        ))}
                    </div>
                </>) : (<CustomSpinner />)
            }
        </>
    )
}

function Affiliations({ value, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [affiliationsValue, setAffiliationsValue] = useState(value);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setAffiliationsValue(value);
    };

    const handleSaveEdit = () => {
        setIsEditing(false);
        onEdit(affiliationsValue);
    };

    const handleInputChange = (event) => {
        setAffiliationsValue(event.target.value);
    };

    return (
        <>
            {isEditing ? (
                <div className='row' style={{ marginTop: '20px', marginBottom: '20px', alignItems: 'center' }}>
                    <div class="col-5">
                        <input type="text" className="form-control" value={affiliationsValue} onChange={handleInputChange} />
                    </div>
                    <div class="col-1" style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon onClick={handleSaveEdit} icon={faSave} size="lg" />
                        {/* <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button> */}
                    </div>
                    <div class="col-1" style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon onClick={handleCancelEdit} icon={faTimesCircle} size="lg" />
                        {/* <button className="btn btn-primary" onClick={handleCancelEdit}>Cancel</button> */}
                    </div>


                </div>
            ) : (
                <div className='row' style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <div class="col-5">
                        <p style={{ paddingLeft: '15px', display: 'flex', alignItems: 'center' }}>{value}</p>
                    </div>
                    <div class="col-1" style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon onClick={handleEditClick} icon={faEdit} size="lg" />
                        {/* <button className="btn btn-primary" onClick={handleEditClick}>Edit</button> */}
                    </div>
                    <div class="col-1" style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon onClick={onDelete} icon={faTrashAlt} size="lg" />
                        {/* <button className="btn btn-primary" onClick={onDelete}>Delete</button> */}
                    </div>
                </div>
            )}
        </>
    );
}

async function createTag(affiliationsValue) {
    // Replace this with your API call to create tag
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(affiliationsValue);
        }, 1000);
    });
}

async function deleteTag(affiliationsValue) {
    // Replace this with your API call to delete tag
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

async function updateTag(oldaffiliationsValue, newAffiliationsValue) {
    // Replace this with your API call to update tag
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

// export default function MyPage() {
//   return (
//     <div>
//       <affiliationsList />
//     </div>
//   );
// }
