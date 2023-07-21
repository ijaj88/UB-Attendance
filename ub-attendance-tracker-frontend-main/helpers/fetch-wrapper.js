import getConfig from 'next/config';

import { userService } from 'services';
import { toast } from 'react-toastify';
import FormData from 'form-data';

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    getData,
    postFileData,
    put,
    delete: _delete,
    patch,
    // tempGet,
    patchWithToken
};

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url),
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);
}

function getData(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url),
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleFileData);
}

// function tempGet(url) {
//     const requestOptions = {
//         method: 'GET'
//     };
//     return fetch(url, requestOptions).then(handleResponse);
// }

// function tempGet(url) {
//     const requestOptions = {
//         method: 'GET'
//     };
//     return fetch(url, requestOptions).then(handleResponse);
// }

function post(url, body) {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);
}

function postFileData(url, formData) {
    const fd = new FormData();
    fd.append("file", formData);
    const boundary = Math.random().toString().substr(2);
    const delimiter = `--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const blob = new Blob([delimiter, `Content-Disposition: form-data; name="file"; filename="${formData.name}"\r\nContent-Type: ${formData.type}\r\n\r\n`, formData, closeDelimiter], { type: 'multipart/form-data; boundary=' + boundary });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`, ...authHeader(url),
        credentials: 'include',
        'Content-Disposition': `form-data; name="file"; filename="${formData.name}"`,
      },
      body: blob,
      signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);    
}

function patch(url, body) {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);    
}

function patchWithToken(url, body, token) {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
        
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);    
}

function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url),
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
    };
    return fetch(url, requestOptions).catch(error => {
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            toast.error("Server down. Please try again after some time!");
        }
        throw error;
    }).then(handleResponse);
}

function authHeader(url) {
    const user = userService.userValue;
    const isLoggedIn = user && user.data.accessToken;
    const isBaseUrl = url.startsWith(publicRuntimeConfig.baseUrl);
    if (isLoggedIn && isBaseUrl) {
        return { Authorization: `Bearer ${user.data.accessToken}` };
    } else {
        return {};
    }
}

function handleResponse(response) {
    
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            
            if ([401, 403].includes(response.status)) {
                // toast.error("Unauthorized!");
                userService.logout();
            }
            // const error = (data && data.message) || response.statusText;
            return Promise.reject(data);
            // return Promise.reject({"statusCode":401,"message":"My Message"})
        }

        return data;

    });
}

async function handleFileData(response) {
    if (!response.ok) {
      throw new Error('Failed to fetch CSV data from the backend API');
    }
    const blob = await response.blob();
    return blob;
}
