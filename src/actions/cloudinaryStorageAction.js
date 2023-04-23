import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_PRESENT_NAME} from '../config/config';
import {OS} from '../utils/regex';

export function assetUploadInCloudinaryServer(photo, isReturnData) {
    return new Promise((resolve, reject) => {
        const data = new FormData();
        let media = {
            uri: OS === 'ios' ? photo.sourceURL : photo.path,
            type: photo.mime,
            name: `${new Date().valueOf().toString()}.png`,
        };
        data.append('file', media);
        data.append('upload_preset', CLOUDINARY_PRESENT_NAME);
        data.append('cloud_name', CLOUDINARY_CLOUD_NAME);
        fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
            method: 'post',
            body: data,
        }).then(res => res.json()).then(data => {
            if (isReturnData) {
                resolve({data, photo});
            } else {
                resolve(data);
            }
        }).catch(err => {
            reject(err);
        })
    });
}
