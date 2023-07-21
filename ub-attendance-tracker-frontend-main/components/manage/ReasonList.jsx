import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { userService } from 'services';
import { toast } from 'react-toastify';
import CustomSpinner from 'components/CustomSpinner';
import { confirmAlert } from 'react-confirm-alert'; // Import

export function ReasonList() {
  const [reasonList, setReasonList] = useState([]);
  const [newReason, setNewReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService.getReasons()
      .then((x) => {
        
        setReasonList(x.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
          toast.error("Unable to fetch Reasons. Please refresh!");
        }
      });
  }, []); 

  const handleInputChange = (event) => {
    setNewReason(event.target.value);
  };

  function handleAddTag() {
    return userService.addReason({"name":newReason})
      .then((output) => {
          setReasonList([...reasonList, output]);
          setNewReason('');
          toast.info("Reason Added");
      }).catch((error) =>{      
        if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
          toast.error("Reason Creation Failed. Please try Again");
        }
      });
  }

  function handleDeleteTag(id) {
    confirmAlert({
      message: 'Are you sure you want to delete this reason?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            return userService.deleteReason(id)
              .then((output) => {
                setReasonList(reasonList => reasonList.filter(reason => reason.id != id));
                toast.info("Reason Deleted");
              })
              .catch((error) => {
                if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
                  toast.error("Reason Deletion Failed. Please try Again");
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

  function handleEditTag(id, newReasonValue) {
      return userService.editReason(id, { "name": newReasonValue })
          .then((output) => {
              const index = reasonList.findIndex(obj => obj.id === id);
              const updatedList = [...reasonList];
              updatedList[index] = output.data;
              setReasonList(updatedList);
              toast.info("Reason Updated");
          }).catch((error) => {
            if (error?.error?.statusCode != 401 && error?.name != 'AbortError' && error?.name != 'TimeoutError'){
              toast.error("Reason Updation Failed. Please try Again");
            }
          });
  }

  return (
    <>
      {!isLoading ? 
        (<>
          <div className="row">
            <div class="col-10">
              <input type="text" className="form-control" placeholder="Type Reason" value={newReason} onChange={handleInputChange} />
            </div>
            <div class="col-2" style={{textAlign:'center'}}>
              <button className="btn btn-primary" onClick={handleAddTag}>Add Reason</button>
            </div>
          </div>
          <div style={{marginBottom:'30px'}}>
            {reasonList.map(({id, name}) => (
              <Reason
                key={name}
                value={name}
                onDelete={() => handleDeleteTag(id)}
                onEdit={(newReasonValue) => handleEditTag(id, newReasonValue)}
              />
            ))}
          </div>
        </>) : (<CustomSpinner />)
      }
    </>
  )
}

function Reason({ value, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [reasonValue, setReasonValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setReasonValue(value);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    onEdit(reasonValue);
  };

  const handleInputChange = (event) => {
    setReasonValue(event.target.value);
  };

  return (
    <>
      {isEditing ? (
        <div className='row' style={{marginTop:'20px',marginBottom:'20px',alignItems:'center'}}>
          <div class="col-5">
            <input type="text" className="form-control" value={reasonValue} onChange={handleInputChange} />
          </div>
          <div class="col-1" style={{textAlign:'center'}}>
            <FontAwesomeIcon type="button" onClick={handleSaveEdit} icon={faSave} size="lg"  />
            {/* <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button> */}
          </div>
          <div class="col-1" style={{textAlign:'center'}}>
            <FontAwesomeIcon type="button" onClick={handleCancelEdit} icon={faTimesCircle} size="lg"  />
            {/* <button className="btn btn-primary" onClick={handleCancelEdit}>Cancel</button> */}
          </div>
          
          
        </div>
      ) : (
        <div className='row' style={{marginTop:'20px',marginBottom:'20px', display: 'flex', alignItems: 'center'}}>
          <div class="col-5">
            <p style={{paddingLeft:'15px', display: 'flex', alignItems: 'center'}}>{value}</p>
          </div>
          <div class="col-1" style={{textAlign:'center'}}>
            <FontAwesomeIcon type="button" onClick={handleEditClick} icon={faEdit} size="lg"  />
            {/* <button className="btn btn-primary" onClick={handleEditClick}>Edit</button> */}
          </div>
          <div class="col-1" style={{textAlign:'center'}}>
            <FontAwesomeIcon type="button" onClick={onDelete} icon={faTrashAlt} size="lg"  />
            {/* <button className="btn btn-primary" onClick={onDelete}>Delete</button> */}
          </div>
        </div>
      )}
    </>
  );
}

async function createTag(reasonValue) {
  // Replace this with your API call to create tag
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reasonValue);
    }, 1000);
  });
}

async function deleteTag(reasonValue) {
  // Replace this with your API call to delete tag
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function updateTag(oldreasonValue, newReasonValue) {
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
//       <reasonList />
//     </div>
//   );
// }
