import {seekerRequestCollection} from '../config/firestore';
import {getStore} from '../../App';
import {MY_SEND_SEEKER_REQUESTS, SEEKER_REQUESTS} from './types';
import {getUserDetail} from './userAction';
import moment from 'moment';
import {createNewNotification} from './notificationsAction';

export function sendSeekerRequest(parameter) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .add({
                ...parameter,
                createdAt: moment().utc().unix(),
            }).then(response => {
            if (Boolean(response._documentPath)) {
                if (Boolean(response._documentPath._parts)) {
                    let parts = response._documentPath._parts;
                    if (parts.length > 1) {
                        let seeker_id = parts[1];
                        createNewNotification({
                            relationship_id: seeker_id,
                            notification_type: 'seeker',
                            to_user: parameter.request_to,
                            from_user: parameter.request_by,
                            seekerDate: parameter.date,
                            address: parameter.address,
                            seekerKey: parameter.seekerKey,
                            request_status: parameter.request_status,
                        });
                    }
                }
            }
            resolve(true);
        });
    });
}

export function getSeekerRequestLists(id) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .where('request_to', '==', id)
            .where('request_status', 'in', ['', 'accepted'])
            .onSnapshot(snapshot => {
                const getUserInfo = snapshot.docs.map(doc => {
                    const firebaseData = {
                        seeker_id: doc.id,
                        ...doc.data(),
                    };
                    return getUserDetail(firebaseData.request_by, firebaseData);
                });

                Promise.all(getUserInfo).then(responseData => {
                    let response = [];
                    for (let v in responseData) {
                        let user = responseData[v].response._data;
                        let data = responseData[v].data;
                        response.push({
                            user,
                            ...data,
                        });
                    }

                    let seekerReadCount = getStore.getState().auth.user.seekerReadCount;
                    if (seekerReadCount !== undefined) {
                        seekerReadCount = response.length - seekerReadCount;
                    } else {
                        seekerReadCount = response.length;
                    }

                    getStore.dispatch({
                        type: SEEKER_REQUESTS,
                        payload: {data: response, count: seekerReadCount},
                    });
                    resolve(response);
                });
            });
    });
}

export function getMySeekerRequestLists(id) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .where('request_by', '==', id)
            .onSnapshot(snapshot => {
                const getUserInfo = snapshot.docs.map(doc => {
                    const firebaseData = {
                        seeker_id: doc.id,
                        ...doc.data(),
                    };
                    return getUserDetail(firebaseData.request_to, firebaseData);
                });

                Promise.all(getUserInfo).then(responseData => {
                    let response = [];
                    for (let v in responseData) {
                        let user = responseData[v].response._data;
                        let data = responseData[v].data;
                        response.push({
                            user,
                            ...data,
                        });
                    }
                    getStore.dispatch({
                        type: MY_SEND_SEEKER_REQUESTS,
                        payload: response,
                    });
                    resolve(response);
                });
            });
    });
}

export function updateSeekerRequestStatus(id, request_status) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .doc(id)
            .set({request_status: request_status}, {merge: true})
            .then(() => {
                resolve(true);
            });
    });
}

export function deleteSeekerRequest(id) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .doc(id)
            .delete()
            .then(() => {
                resolve(true);
            });
    });
}

export function updateLatestMessageInSeeker(id, parameter) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .doc(id)
            .set({
                    latestMessage: {
                        ...parameter,
                        createdAt: moment().utc().unix(),
                    },
                },
                {merge: true}).then(response => {

        });
    });
}

export function addMessageInSeeker(id, parameter) {
    return new Promise((resolve, reject) => {
        seekerRequestCollection
            .doc(id)
            .collection('Messages')
            .add({
                ...parameter,
                createdAt: moment().utc().unix(),
            }).then(response => {
            resolve(true)
        })
    });
}
