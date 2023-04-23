import {conversationsCollection} from '../config/firestore';
import moment from 'moment';
import {getStore} from '../../App';
import {CONVERSATIONS} from './types';
import {getAllMatchesLists} from './matchesAction';

export function createNewConversation(id, members) {
    return new Promise((resolve, reject) => {
        conversationsCollection.doc(id).set({
            matches_id: id,
            members,
            latestMessage: {
                text: ``,
                createdAt: moment().utc().unix(),
            },
            status: 'Active',
        }).then(() => {
            resolve(true);
        }).catch(error => {
            reject(false);
        });
    });
}

export function getAllConversationLists(uid) {
    return new Promise((resolve, reject) => {
        getAllMatchesLists(uid).then(response => {
            if (response.length > 0) {
                let getConversations = response.map(function (o) {
                    return o.customId;
                });

                conversationsCollection
                    .where('matches_id', 'in', getConversations)
                    .onSnapshot(snapshot => {
                        if (Boolean(snapshot)) {
                            let docs = snapshot.docs;
                            let conversations = [];
                            let conversationUnreadCount = 0;
                            for (let v in docs) {
                                let data = {
                                    ...docs[v]._data,
                                };
                                let obj = response.find(o => o.customId === data.matches_id);
                                data.user = obj.user;

                                let latestMessage = data.latestMessage;
                                const {createdAt} = latestMessage;
                                let checkRead = Boolean(data[uid]) ? (data[uid] < createdAt) : true;
                                if (checkRead) {
                                    conversationUnreadCount += 1;
                                }

                                conversations.push(data);
                            }

                            getStore.dispatch({
                                type: CONVERSATIONS,
                                payload: {data: conversations, count: conversationUnreadCount},
                            });
                            resolve(conversations);
                        }
                    });
            }
        });
    });
}

export function updateLatestMessageInConversation(id, data) {
    return new Promise((resolve, reject) => {
        let parameter = {};
        let createdAt = moment().utc().unix();
        parameter[data.user._id] = createdAt;
        parameter['latestMessage'] = {
            ...data,
            createdAt,
        };
        conversationsCollection
            .doc(id)
            .set(parameter, {merge: true}).then(response => {

        });
    });
}

export function readMessageInConversation(id, uid) {
    return new Promise((resolve, reject) => {
        let parameter = {};
        parameter[uid] = moment().utc().unix();
        conversationsCollection
            .doc(id)
            .set(parameter, {merge: true}).then(response => {

        });
    });
}

export function addMessageInConversation(id, parameter) {
    return new Promise((resolve, reject) => {
        conversationsCollection
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
