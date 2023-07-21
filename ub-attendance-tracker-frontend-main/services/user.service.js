import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { toast } from 'react-toastify';

//const { publicRuntimeConfig } = getConfig();
// const baseUrl = `http://52.86.41.7:3000/api/v1`; // for development purpose
// const baseUrl =  'http://stark.cse.buffalo.edu:23200/api/v1'
const baseUrl =  'https://webdev.cse.buffalo.edu/attendance/api/api/v1'
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));
// const userRolesSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('userRoles')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    // get userRoleValue () { return userRolesSubject.value && userRolesSubject.value[0] },
    // getUserRole,
    login,
    logout,
    register,
    getUserProfile,
    editProfile,
    editAffiliations,
    initiateChangePassword,
    changePassword,
    getAllUsers,
    getAllEvents,
    getEvents,
    createEvent,
    markEventAttendance,
    markSpaceAttendance,
    markSpaceAttendanceReason,
    getEventById,
    getAllSpaces,
    getSpaces,
    deleteEvent,
    deleteSpace,
    createSpace,
    getSpaceById,
    uploadCSVData,
    updateEvent,
    updateSpace,
    updateUserRole,
    getReasons,
    getAffiliations,
    getSeries,
    createSeries,
    // getSpaces,
    // deleteSpace,    
    addAffiliations,
    editAffiliation,
    deleteAffiliation,
    addReason,
    editReason,
    deleteReason,
    // getEventsAttendanceGroupedByAttribute,
    // getEventsAttendance,
    getSpaceAttendanceWithId,
    downloadCSVWithStatId,
    getSpaceAttendance,
    getEventAttendanceWithSpaceId,
    getAllEventsAttendance,
    getEventAttendanceWithId,
    verifyAccount,
    getEventAttendanceWithSeriesId,
    getBasicEventAttendanceStats,
    getBasicSpaceAttendanceStats,
    // changePassword
};

function getTwoMonthsEarlierTimestamp(timestamp) {
    const inputDate = new Date(timestamp);
    
    const twoMonthsEarlier = new Date(inputDate.getFullYear(), inputDate.getMonth() - 2, inputDate.getDate(), inputDate.getHours(), inputDate.getMinutes(), inputDate.getSeconds(), inputDate.getMilliseconds());
    
    return twoMonthsEarlier.toISOString();
  }

function getSpaceAttendanceWithId(spaceId, from, to) {
    to = to + 'T23:59:59.999Z'
    return fetchWrapper.get(`${baseUrl}/stats/12/?spaceId=${spaceId}&fromTimestamp=${from}&toTimestamp=${to}`);
}

function downloadCSVWithStatId(statId, uuid) {
    if(statId === 16)
    {
        return fetchWrapper.getData(`${baseUrl}/stats/${statId}/?file=${true}&spaceId=${uuid}`);
    }
    else if(statId === 18)
    {
        return fetchWrapper.getData(`${baseUrl}/stats/${statId}/?file=${true}&eventId=${uuid}`);
    }
    else if(statId === 17)
    {
        return fetchWrapper.getData(`${baseUrl}/stats/${statId}/?file=${true}&seriesId=${uuid}`);
    }
    
}
function getSpaceAttendance() {
    return fetchWrapper.get(`${baseUrl}/stats/10`);
}

function changePassword(user) {
    return fetchWrapper.post(`${baseUrl}/auth/ForgotPassVerify`, user);
}

function initiateChangePassword(user) {
    // return Promise.resolve({"status":"SUCCESS"})
    return fetchWrapper.post(`${baseUrl}/auth/ForgotPassword`, user);
}

function getEventAttendanceWithSpaceId(spaceId){
    return fetchWrapper.get(`${baseUrl}/stats/11/?spaceId=${spaceId}`);
}

function getEventAttendanceWithSeriesId(seriesId,_from,_to){
    const from = '1970-01-01'
    var to = new Date();
    to = to.toISOString().substr(0, 10)+ 'T23:59:59.999Z';
    return fetchWrapper.get(`${baseUrl}/stats/13/?seriesId=${seriesId}&fromTimestamp=${from}&toTimestamp=${to}`);
}

function getBasicEventAttendanceStats(eventId){
    return fetchWrapper.get(`${baseUrl}/stats/19/?eventId=${eventId}`);
}

function getBasicSpaceAttendanceStats(spaceId){
    return fetchWrapper.get(`${baseUrl}/stats/20/?spaceId=${spaceId}`);
}

function getEventAttendanceWithId(eventId,_from,_to){
    // return fetchWrapper.get('/attendance/random_data5.json').then((output)=>{
    //     return output;
    // });
    const from = '1970-01-01'
    var to = new Date();
    to = to.toISOString().substr(0, 10)+ 'T23:59:59.999Z';
    return fetchWrapper.get(`${baseUrl}/stats/8/?eventId=${eventId}&fromTimestamp=${from}&toTimestamp=${to}`);
}

function getAllEventsAttendance(){
    return fetchWrapper.get(`${baseUrl}/stats/9`);
}

function editAffiliations(user){
    return fetchWrapper.post(`${baseUrl}/CommonAffService/patchAffiliation`,user);
}

function login(username, password) {
    // const email = username + '@buffalo.edu';
    return fetchWrapper.post(`${baseUrl}/auth/login`, { username, password })
        .then(user => {
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            // return getUserProfile()
            // .then(x => {
            //     
            //     userRolesSubject.next(x["data"]["roles"]);
            //     localStorage.setItem('userRoles', JSON.stringify(x["data"]["roles"]));
            // })
            // .catch((error)=>{
            //     // localStorage.removeItem('user');
            //     // userSubject.next(null);
            //     toast.info("Unknown Error");
            //     return error;
            // })
        }).catch((error) =>{
            throw error;
        });
}

function logout() {
    // localStorage.removeItem('userRoles');
    // userRolesSubject.next(null);
    localStorage.removeItem('user');
    userSubject.next(null);
    const currentUrl = Router.asPath;
    if (!currentUrl.includes('/account/login') && !currentUrl.includes('/account/logout')){
        Router.push({
            pathname: '/account/login',
            query: { returnUrl: currentUrl }
        });
    }
}

// function getUserRole() {
//     if (userRolesSubject.value && userRolesSubject.value[0]){
//         return userRolesSubject.value[0];
//     }else{
//         getUserProfile()
//             .then(x => {
//                 
//                 userRolesSubject.next(x["data"]["roles"]);
//                 localStorage.setItem('userRoles', JSON.stringify(x["data"]["roles"]));
//                 return userRolesSubject.value[0];
//             })
//             .catch((x)=>{
//                 
//                 alert("Unknown Error");
//             })
//     }
// }

function register(user) {    
    delete user['confirmPassword'];
    user["old_registration"] = 0;
    if (!user.hasOwnProperty('affilations')) {
        user['affilations'] = [];
    }
    return fetchWrapper.post(`${baseUrl}/auth/register`, user);
}

function verifyAccount(username,verificationCode) {
    return fetchWrapper.post(`${baseUrl}/auth/userverification`, {"username":username, "token":verificationCode});
    // return Promise.resolve({"status":"SUCCESS"})
}

function getReasons(user) { 
    return fetchWrapper.get(`${baseUrl}/reasons`);
}

function getAllUsers() {    
    return fetchWrapper.get(`${baseUrl}/users?limit=1000000`);
}

function addReason(user) {
    return fetchWrapper.post(`${baseUrl}/reasons`, user);
}

function editReason(id, user) {
    return fetchWrapper.patch(`${baseUrl}/reasons/${id}`, user);
}

function deleteReason(id) {
    return fetchWrapper.delete(`${baseUrl}/event/DeleteReason/${id}`);
}

function addAffiliations(user) {
    return fetchWrapper.post(`${baseUrl}/CommonAffService`, user);
}

function editAffiliation(id, user) {
    return fetchWrapper.patch(`${baseUrl}/CommonAffService/${id}`, user);
}

function deleteAffiliation(id) {
    return fetchWrapper.delete(`${baseUrl}/CommonAffService/${id}`);
}

function getAffiliations() {
    // return Promise.resolve([{"name":"temp","isActive":true},{"name":"temp2","isActive":false}])
    return fetchWrapper.get(`${baseUrl}/CommonAffService`);
}

function getSeries() {   
    // return sleep(300).then(() => {
    //     throw Error("test");
    // }); 
    return fetchWrapper.get(`${baseUrl}/event/series`);
}

function createSeries(user) {    
    return fetchWrapper.post(`${baseUrl}/event/series`,user);
}


function createSpace(user) {
    user['category'] = '-1';
    user['organizedBy'] = 'random';
    return fetchWrapper.post(`${baseUrl}/space/create`, user);
}

function markSpaceAttendance(spaceId) {
    // return Promise.resolve({"data":{"attended":true}})
    return fetchWrapper.post(`${baseUrl}/space/attendance/${spaceId}`,{});
}

function markSpaceAttendanceReason(user) {
    return fetchWrapper.patch(`${baseUrl}/space/attendance/reason`,user);
}

function createEvent(user) {
    // user['categoryId'] = '7777';
    // user['from'] = user['dateField']
    // user['to'] = user['dateField']
    // delete user['dateField'];
    
    user['categoryId'] = '-1';
    user['organizedBy'] = 'random';
    return fetchWrapper.post(`${baseUrl}/event/create`, user);
}

function markEventAttendance(eventId) {
    return fetchWrapper.post(`${baseUrl}/event/${eventId}/action/attend`,{});
}

function updateSpace(user,id) {
    // return sleep(300).then(() => {
    //     throw Error("test");
    // });
    user['category'] = '7777';
    user['organizedBy'] = 'random@buffalo.edu';
    return fetchWrapper.patch(`${baseUrl}/space/${id}`, user);
}

function updateEvent(user,id) {
    
    if(user.categoryId === '')
    {
        user['categoryId'] = '-1';
    }
    return fetchWrapper.patch(`${baseUrl}/event/${id}`, user);
}

function updateUserRole(user) {
    return fetchWrapper.patch(`${baseUrl}/users/role`, user);
}

function editProfile(user) {
    
    return fetchWrapper.patch(`${baseUrl}/users`, user);
}

// function changePassword(user,token) {
//     return fetchWrapper.patchWithToken(`${baseUrl}/users`, user, token);
// }

function getUserProfile() {
    // return sleep(300).then(() => {
    //     throw Error("test");
    // });
    return fetchWrapper.get(`${baseUrl}/users/me`);
    
    
}

function getSpaceById(id) {
    // return sleep(300).then(() => {
    //     throw Error("test");
    // });
    return fetchWrapper.get(`${baseUrl}/space/${id}`);
}

function getEventById(id) {
    // return sleep(300).then(() => {
    //     throw Error("test");
    // }); 
    return fetchWrapper.get(`${baseUrl}/event/${id}`);
}

function getEvents() {
    // return Promise.resolve({"data":[]})
    return fetchWrapper.get(`${baseUrl}/event?limit=1000000`);
}

function getAllEvents() {
    return fetchWrapper.get(`${baseUrl}/event`);
}

function getAllSpaces() {
    return fetchWrapper.get(`${baseUrl}/space`);
}

function getSpaces() {
    // return sleep(300).then(() => {
    //     throw Error("test");
    // });
    return fetchWrapper.get(`${baseUrl}/space?limit=1000000`);
}

function deleteEvent(id) {
    return fetchWrapper.delete(`${baseUrl}/event/${id}`);
}

function deleteSpace(id) {
    return fetchWrapper.delete(`${baseUrl}/event/DeleteSpace/${id}`);
}

function uploadCSVData(file){
    return fetchWrapper.postFileData(`${baseUrl}/users/upload`, file);
}

// function getEventsAttendanceGroupedByAttribute(selectedAttribute) {
//     sleep(5000).then(() => {
//         
//     });
//     if (selectedAttribute === 'affiliation'){
//         return Promise.resolve({"data":[{"affiliation":"A1","count":4},{"affiliation":"A2","count":4},{"affiliation":"A3","count":4},{"affiliation":"A4","count":4},{"affiliation":"A5","count":4}]})
//     }else{
//         return Promise.resolve({"data":[{"department":"D1","count":10},{"department":"D2","count":10},{"department":"D3","count":10},{"department":"D4","count":21}]})
//     }
    
//     // return fetchWrapper.delete(`${baseUrl}/${id}`);
// }

// function getEventsAttendance(eventId, from, to) {
//     return sleep(300).then(() => {
//         return fetchWrapper.get('/attendance/random_data4.json').then((output)=>{
//             return output;
//         });
//     });
    
    
//     // return fetchWrapper.tempGet("https://my.api.mockaroo.com/attendance.json?key=f871ea10");
    
// }

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}