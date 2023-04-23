import {matchesCollection} from '../config/firestore';
import moment from 'moment';
import {getUserDetail} from './userAction';
import {getStore} from '../../App';
import {MATCHES} from './types';
import {createNewConversation, getAllConversationLists} from './conversationsAction';
import {createNewNotification} from './notificationsAction';

export function checkMatchExits(uid, other_uid) {
    return new Promise((resolve, reject) => {
        matchesCollection
            .where('members', 'in', [[uid, other_uid], [other_uid, uid]])
            .onSnapshot(snapshot => {
                if (Boolean(snapshot)) {
                    resolve(snapshot.docs);
                }
            });
    });
}

export function addSwipeMatch(uid, other_uid) {
    return new Promise((resolve, reject) => {
        checkMatchExits(uid, other_uid).then(response => {
            if (response.length === 0) {
                let customId = `${uid}${other_uid}`;
                matchesCollection.doc(customId)
                    .set({
                        customId,
                        uid,
                        other_uid,
                        last_swipe_by: uid,
                        members: [uid, other_uid],
                        createdAt: moment().utc().unix(),
                        status: 'Active',
                    }, {merge: true})
                    .then(() => {
                        createNewNotification({
                            relationship_id: customId,
                            notification_type: 'matches',
                            to_user: other_uid,
                            from_user: uid,
                        });
                        createNewConversation(customId, [uid, other_uid]);
                        resolve(true);
                    }).catch(error => {
                    reject(false);
                });
            } else {
                resolve(false);
            }
        });
    });
}

function getUserMatch(data) {
    return new Promise((resolve, reject) => {
        matchesCollection
            .where(data.key, '==', data.value)
            .get().then(snapshot => {
            if (Boolean(snapshot)) {
                resolve(snapshot.docs);
            }
        });
    });
}


export function getAllMatchesLists(uid, isGetConversation) {
    return new Promise((resolve, reject) => {
        let add = [];
        add.push(getUserMatch({key: 'uid', value: uid}));
        add.push(getUserMatch({key: 'other_uid', value: uid}));

        Promise.all(add).then(response => {
            let getUserInfo = [];
            for (let a in response) {
                let data = response[a];
                for (let v in data) {
                    let snapData = data[v]._data;
                    let getUID = snapData.uid === uid ? snapData.other_uid : snapData.uid;
                    getUserInfo.push(getUserDetail(getUID, snapData));
                }
            }

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
                    type: MATCHES,
                    payload: response,
                });

                if (isGetConversation) {
                    getAllConversationLists(uid);
                }

                resolve(response);
            });

        })
    })
}
