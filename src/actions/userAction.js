import {SET_USER_DATA} from './types';
import {usersCollection} from './../config/firestore';
import {getStore} from '../../App';
import auth from '@react-native-firebase/auth';
import {regex} from '../utils/regex';
import {getGeoHashRange} from '../utils/location';
import moment from "moment";

export function createNewUserAction(uid, parameter) {
    return new Promise((resolve, reject) => {
        usersCollection.doc(uid).set(parameter).then((response) => {
            return resolve(response);
        }).catch(error => {
            return reject(error);
        });
    });
}

export function updateUserAction(uid, parameter, callFrom) {
    return new Promise((resolve, reject) => {
        usersCollection.doc(uid).update(parameter).then(() => {
            if (callFrom !== 'register') {
                getUserDetail(uid, parameter).then(data => {
                    let response = data.response._data;
                    getStore.dispatch({
                        type: SET_USER_DATA,
                        payload: response,
                    });
                    return resolve(response);
                });
            } else {
                resolve(true);
            }
        }).catch(error => {
            return reject(error);
        });
    });
}

export function getUserDetail(uid, data) {
    return new Promise((resolve, reject) => {
        usersCollection.doc(uid).get().then((response) => {
            return resolve({response, data});
        }).catch(error => {
            return reject(error);
        });
    });
}

export const getUserDataAndUpdateInFirestore = (response) => {
    return new Promise((resolve, reject) => {
        let user = response.user;
        let providerId = response.additionalUserInfo.providerId;
        let getUser = user._user;
        if (getUser) {
            let uid = getUser.uid;
            let parameter = {
                uid: uid,
                name: regex.isEmpty(getUser.displayName) ? '' : getUser.displayName,
                email: regex.isEmpty(getUser.email) ? '' : getUser.email,
                profilePic: regex.isEmpty(getUser.photoURL) ? '' : getUser.photoURL,
                socialType: providerId === 'facebook.com' ? 'facebook' : (providerId === 'google.com' ? 'google' : 'phone'),
            };
            getUserDetail(uid, user).then(data => {
                let getUser = data.response;
                if (getUser.exists) {
                    resolve({exists: getUser.exists, user: getUser.data()});
                } else {
                    parameter.stepCompleted = 0;
                    parameter.notificationOn = true;
                    parameter.matchOn = true;
                    parameter.soundOn = true;
                    parameter.online = true;
                    parameter.status = 'Inactive';
                    parameter.role = 'normal';
                    parameter.createdAt = moment().utc().unix();
                    parameter.updatedAt = moment().utc().unix();
                    createNewUserAction(uid, parameter).then(() => {
                        resolve({exists: getUser.exists, user: parameter}); // New User Added
                    });
                }
            });
        } else {
            reject('Something went wrong.');
        }
    });
};

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        let user = auth().currentUser;
        if (!regex.isEmpty(user)) {
            let getUser = user._user;
            let uid = getUser.uid;
            getUserDetail(uid, user).then(data => {
                let getUser = data.response;
                if (getUser.exists) {
                    resolve({user: getUser.data()});
                } else {
                    reject({user: null});
                }
            });
        }
    });
};

export function deleteUser(uid) {
    return new Promise((resolve, reject) => {
        usersCollection.doc(uid).delete().then(() => {
            resolve(true);
        });
    });
}

export function discoverUsers(uid, location, distance) {
    return new Promise((resolve, reject) => {
        const {latitude, longitude} = location;
        const range = getGeoHashRange(latitude, longitude, distance);

        usersCollection
            .where('location.geoHash', '>=', range.lower)
            .where('location.geoHash', '<=', range.upper)
            .onSnapshot(snapshot => {
                if (Boolean(snapshot)) {
                    resolve(snapshot.docs);
                }
            })
    });
}
