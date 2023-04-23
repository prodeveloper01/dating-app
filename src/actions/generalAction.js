import {getStore} from '../../App';
import moment from 'moment';
import {regex} from '../utils/regex';
import {seekerData} from '../json/seekerData';

export function setFormatAsPerGiftedChatArray(response, otherUser) {
    let currentUser = getStore.getState().auth.user;
    const getMessages = response.docs.map(doc => {
        const firebaseData = doc.data();

        const data = {
            _id: doc.id,
            ...firebaseData,
            createdAt: moment.unix(firebaseData.createdAt).local(),
        };

        if (!firebaseData.system) {
            data.user = firebaseData.user._id === currentUser.uid ? {
                ...firebaseData.user,
                name: currentUser.name,
                avatar: regex.getProfilePic(currentUser.photos),
            } : {
                ...firebaseData.user,
                name: otherUser.name,
                avatar: regex.getProfilePic(otherUser.photos),
            };
        }

        return data;
    });
    return getMessages;
}

export function getSeekerTitle(key) {
    return seekerData.find(function (o) {
        return o.key === key;
    });
}
