import React from 'react';
import { userService } from 'services';
import { toast } from 'react-toastify';

const DownloadButton = ({ statId, uuid, name, prefix }) => {

    const handleDownload = async () => {
        if (!uuid){
          toast.error('No Input Provided');
          return;
        }
        try {
          const csvData = await userService.downloadCSVWithStatId(statId, uuid);
    
          const url = window.URL.createObjectURL(csvData);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${prefix}_${name}_${uuid}.csv`;
          a.click();
          a.remove();
        } catch (error) {
          toast.error('Unable to download CSV. Please try again');
        }
      };

    return (
        <button
            onClick={handleDownload}
            type="button"
            className="btn btn-primary"
            // style={{ fontSize: '16px', padding: '4px 8px' }}
        >
            Download
        </button>
    );
};

export default DownloadButton;