import { userService } from 'services';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function UserDataUpload() {
    const [uploading, setUploading] = useState(false);
    
    const UploadAnimation = () => {
        return (
          <div className="upload-animation">
            <span>Uploading...</span>
          </div>
        );
      };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setUploading(true); // Set loading state to true when file upload is initiated
            return userService.uploadCSVData(file)
                .then(() => {
                    toast.info("File Successfully Uploaded");
                })
                .finally(() => setUploading(false)); // Set loading state to false when upload is completed
        };
        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const url = '/attendance/userDemographicTemplate.csv';
        const a = document.createElement('a');
        a.href = url;
        a.download = 'userDemographicTemplate.csv';
        a.click();
        a.remove();
      };

    return (
        <div style={{ padding: '10px' }}>
            <style jsx>{`
                    input[type="file"] {
                    display: none;
                    }
                    .file-upload-btn {
                    display: inline-block;
                    background-color: #0077cc;
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    }
                    
                    .file-upload-btn:hover {
                    background-color: #005ea8;
                    }
                    
                    .file-upload-btn:active {
                    background-color: #003d71;
                    }
                `}</style>

            <a type="btn" onClick={downloadTemplate} style={{color: 'blue', textDecoration: 'underline'}}>Download Template</a>
            <div style={{marginTop:'50px'}}>
                <label htmlFor="csv-file" className="file-upload-btn">
                    Choose Your CSV File
                </label>
                <input type="file" name="csv-file" id="csv-file" onChange={handleFileUpload} />
                {uploading && <UploadAnimation />}
            </div>
            
        </div>
    );

}