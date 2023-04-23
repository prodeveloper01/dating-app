import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {LOGOUT} from '../actions/types';
import {getStore} from '../../App';
import {regex} from '../utils/regex';
import {PINK} from '../themes/constantColors';
import FastImage from 'react-native-fast-image';
import {getCurrentUser} from '../actions/userAction';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.bootstrapAsync();
    regex.changeStatusStyle('default');
    StatusBar.setHidden(true);
  }

  bootstrapAsync = async () => {
    let userToken;

    try {
      userToken = await AsyncStorage.getItem('userToken');
      if (userToken !== null) {
        getCurrentUser().then(user => {
          StatusBar.setHidden(false);
          let stepCompleted = user.user.stepCompleted;
          if (stepCompleted > 8)
            regex.setDashboard({token: user.user.uid, ...user.user});
          else
            this.openAuth();
        }).catch((error) => {
          this.openAuth();
        })
      } else
        this.openAuth();
    } catch (e) {
        this.openAuth();
    }
  };

  openAuth = () => {
    StatusBar.setHidden(false);
    regex.authSignOut();
    getStore.dispatch({type: LOGOUT});
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: PINK,
        }}>
        <FastImage source={require('./../assets/splash_logo.png')} style={{width: 136, height: 120}}/>
      </View>
    );
  }
}

export default SplashScreen;
