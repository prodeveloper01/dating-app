import Geolocation from '@react-native-community/geolocation';
import {getStore} from '../../App';
import {GET_LOCATION} from '../actions/types';
import {updateUserAction} from '../actions/userAction';
import auth from '@react-native-firebase/auth';
import geohash from 'ngeohash';

export function distance(location, location1, unit) {
    let lat1 = location.latitude,
        lon1 = location.longitude,
        lat2 = location1.latitude,
        lon2 = location1.longitude;

    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    } else {
        let radlat1 = Math.PI * lat1/180;
        let radlat2 = Math.PI * lat2/180;
        let theta = lon1-lon2;
        let radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344 }
        if (unit === "N") { dist = dist * 0.8684 }
        return Math.round(dist);
    }
}

// Calculate the upper and lower boundary geohashes for
// a given latitude, longitude, and distance in miles
export const getGeoHashRange = (latitude: number, longitude: number, distance: number) => {
    const lat = 0.0144927536231884; // degrees latitude per mile
    const lon = 0.0181818181818182; // degrees longitude per mile

    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;

    const greaterLat = latitude + lat * distance;
    const greaterLon = longitude + lon * distance;

    const lower = geohash.encode(lowerLat, lowerLon);
    const upper = geohash.encode(greaterLat, greaterLon);

    return {
        lower,
        upper
    };
};

function setLocationConfiguration() {
    Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse'
    });
}

export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        setLocationConfiguration();
        Geolocation.getCurrentPosition((position) => {
            if (Boolean(position.coords)) {
                let coords = position.coords;
                getStore.dispatch({type: GET_LOCATION, payload: coords});
                const latitude = coords.latitude;
                const longitude = coords.longitude;
                const geoHash = geohash.encode(latitude, longitude);
                updateUserAction(auth().currentUser._user.uid, {location: {latitude, longitude, geoHash}}, 'location');
            }
            resolve(position)
        }, error => {
                reject(error.code);
        });
    });
}

