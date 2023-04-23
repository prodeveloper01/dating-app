'use strict';

import {Alert, Dimensions, Platform, StatusBar, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {HIDE_LOADER, LOGIN, LOGOUT, SHOW_LOADER, STORAGE_KEY} from '../actions/types';
import {getStore} from '../../App';
import * as messages from './messages';
import {TIMETEXTCOLOR} from '../themes/constantColors';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import {updateUserAction} from '../actions/userAction';

export const {OS} = Platform;
export const TouchableFeedback = OS === 'ios' ? TouchableWithoutFeedback : TouchableWithoutFeedback;

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

export const W_HEIGHT = Dimensions.get('window').height;
export const W_WIDTH = Dimensions.get('window').width;

export const ASPECT_RATIO = (value) => (value * W_HEIGHT) / 568;
export const HEIGHT_RATIO = (value) => (value * W_HEIGHT);

let isIPhoneX = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX =
      (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
      (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
}

export function getStatusBarHeight(skipAndroid) {
  return Platform.select({
    ios: isIPhoneX ? 40 : 20,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0,
  });
}

export const Header_Height = getStatusBarHeight() + (Platform.OS === 'ios' ? 44 : 34);

export const shadow = (elevation = 4, spread = 5, offsetX = 0, offsetY = 0) => Platform.select({
  ios: {
    shadowOffset: {
      width: offsetX,
      height: offsetY
    },
    shadowOpacity: 0.5,
    shadowRadius: spread,
    shadowColor: TIMETEXTCOLOR
  },
  android: {
    elevation: elevation
  }
});

export const MAX_CARD_SWIPE_LIMIT = 5;

export const regex = {
  isEmpty: (val) => {
    switch (val) {
      case '':
      case 0:
      case '0':
      case null:
      case false:
      case undefined:
      case typeof this === 'undefined':
        return true;
      default:
        return false;
    }
  },

  validateEmail: (val) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      val,
    );
  },

  validatePhoneNumber: (val) => {
    return /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/.test(val);
  },

  validatePassword: (val) => {
    return /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*_]\S{5,16}$/.test(val);
  },

  validateUsername: (val) => {
    return /^[A-Za-z0-9_]{3,20}$/.test(val)
  },

  matchPassword: (val1, val2) => {
    if (val1 !== val2) {
      return false;
    } else {
      return true;
    }
  },

  hasNotch: () => {
    let hasNotch = false;
    if (Platform.OS === 'android') {
      hasNotch = StatusBar.currentHeight > 24;
    } else {
      hasNotch = StatusBar.currentHeight > 20;
    }

    return hasNotch;
  },

  sortData: (property) => {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  },

  isInt: (n) => {
    return Number(n) === n && n % 1 === 0;
  },

  isFloat: (n) => {
    return Number(n) === n && n % 1 !== 0;
  },

  changeStatusStyle: (type) => {
    // if (OS === 'android')
    //   StatusBar.setHidden(true);

    StatusBar.setBarStyle(type, true);
  },

  getProfilePic: (photos) => {
    if (photos !== undefined) {
      if (photos.length > 0)
        return photos[0].photoUrl;
      else
        return 'https://i7.uihere.com/icons/263/936/60/user-avatar-dad7b8c4dcef5018355540aed51e83ea.png';
    } else
      return 'https://i7.uihere.com/icons/263/936/60/user-avatar-dad7b8c4dcef5018355540aed51e83ea.png';
  },

  getAge: (dob) => {
    if (Boolean(dob)) {
      let birthday = moment(dob, 'MM / DD / YYYY');
      let age  = moment().diff(birthday, 'years');
      if (age > 0)
        return `, ${age}`;
      else
        return '';
    } else {
      return '';
    }
  },

  setDashboard: (data) => {
    return new Promise(async (resolve, reject) => {
      await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
      getStore.dispatch({type: LOGIN, payload: data});
      regex.changeStatusStyle('light-content');
      resolve(true);
    });
  },

  checkPremiumUser: (packageEndDate) => {
     return Boolean(packageEndDate);
  },

  getDayLeft: (packageEndDate) => {
     if (regex.checkPremiumUser(packageEndDate)) {
       let endDate = moment.unix(packageEndDate).local();
       let startData = moment();
       return endDate.diff(startData, 'days');
     } else
       return 0;
  },

  isPremiumUser: (packageEndDate) => {
      return regex.getDayLeft(packageEndDate) !== 0
  },

  logout: async (navigation) => {
    Alert.alert(
      'Logout',
      messages.logout,
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            navigation.closeDrawer();
            regex.clearData();
          },
        },
      ],
      {cancelable: false},
    );
  },

  authSignOut: () => {
    let user = auth().currentUser;
    if (Boolean(user)) {
      let getUser = user._user;
      let uid = getUser.uid;
      updateUserAction(uid, {online: false}, 'register');
      auth().signOut().then(() => console.log('User signed out!'));
    }
  },

  clearData: async () => {
    regex.authSignOut();
    regex.changeStatusStyle('default');
    await AsyncStorage.clear();
    getStore.dispatch({type: LOGOUT});
  },

  showLoader: () => {
    getStore.dispatch({
      type: SHOW_LOADER,
    });
  },

  hideLoader: () => {
    getStore.dispatch({
      type: HIDE_LOADER,
    });
  },

  setThemeID: (theme) => {
    return new Promise(async (resolve, reject) => {
      await AsyncStorage.setItem(STORAGE_KEY, theme.key);
      resolve(true);
    });
  },
};
