import {swipeCardsCollection} from '../config/firestore';
import moment from 'moment';
import {getUserDetail} from './userAction';
import {getStore} from '../../App';
import {PEOPLE_WHO_LIKED} from './types';
import {addSwipeMatch} from './matchesAction';

export function checkOtherUserSwipeExits(uid, other_uid) {
    return new Promise((resolve, reject) => {
        swipeCardsCollection
            .where('uid', '==', other_uid)
            .where('other_uid', '==', uid)
            .where('action', 'in', ['like', 'superLike'])
            .get().then(snapshot => {
            if (Boolean(snapshot)) {
                resolve(snapshot.docs);
            }
        });
    });
}

export function swipeCardUser(uid, other_uid, action) {
    return new Promise((resolve, reject) => {
        swipeCardsCollection.doc(`${uid}${other_uid}`).set({
            uid,
            other_uid,
            action,
            createdAt: moment().utc().unix(),
            status: 'Active',
        }, {merge: true}).then(() => {
            checkOtherUserSwipeExits(uid, other_uid).then(responseData => {
                if (responseData.length > 0 && [action === 'like' || action === 'superLike']) {
                    addSwipeMatch(uid, other_uid).then(response => resolve(response));
                } else {
                    reject(false);
                }
            });
        });
    });
}

export function getWhoLikedMeLists(uid) {
    return new Promise((resolve, reject) => {
        swipeCardsCollection
            .where('other_uid', '==', uid)
            .where('action', '==', 'like')
            .onSnapshot(snapshot => {
                if (Boolean(snapshot)) {
                    let getUserInfo = [];
                    for (let v in snapshot.docs) {
                        let data = snapshot.docs[v]._data;
                        getUserInfo.push(getUserDetail(data.uid, data));
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

                        let likedReadCount = getStore.getState().auth.user.likedReadCount;
                        if (likedReadCount !== undefined) {
                            likedReadCount = response.length - likedReadCount;
                        } else {
                            likedReadCount = response.length;
                        }

                        getStore.dispatch({
                            type: PEOPLE_WHO_LIKED,
                            payload: {data: response, count: likedReadCount}
                        });
                        resolve(response);
                    });
                }
            })
    });
}
