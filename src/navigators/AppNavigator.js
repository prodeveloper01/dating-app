import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {connect} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import enableFontPatch from './enableFontPatch';
import GetStartedScreen from '../screens/auth/GetStartedScreen';
import HomeScreen from '../screens/dashboard/home/HomeScreen';
import LoginAndRegisterScreen from '../screens/auth/LoginAndRegisterScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import RegistrationStepScreen from '../screens/auth/RegistrationStepScreen';
import AddPhotoScreen from '../screens/auth/AddPhotoScreen';
import CongratulationsScreen from '../screens/auth/CongratulationsScreen';
import MenuScreen from '../screens/dashboard/menu/MenuScreen';
import MatchesScreen from '../screens/dashboard/matches/MatchesScreen';
import MessagesScreen from '../screens/dashboard/messages/MessagesScreen';
import WhoLikesMeScreen from '../screens/dashboard/messages/WhoLikesMeScreen';
import SeekerRequestScreen from '../screens/dashboard/seekers/SeekerRequestListsScreen';
import PaymentPackagesScreen from '../screens/dashboard/payment/PaymentPackagesScreen';
import PaymentMethodScreen from '../screens/dashboard/payment/PaymentMethodScreen';
import NotificationsScreen from '../screens/dashboard/notifications/NotificationsScreen';
import SeekerDetailScreen from '../screens/dashboard/seekers/SeekerDetailScreen';
import SeekerListsScreen from '../screens/dashboard/seekers/SeekerListsScreen';
import SeekerUsersScreen from '../screens/dashboard/seekers/SeekerUsersScreen';
import SeekerSendRequestScreen from '../screens/dashboard/seekers/SeekerFormScreen';
import SettingsScreen from '../screens/dashboard/settings/SettingsScreen';
import AccountSettingScreen from '../screens/dashboard/settings/AccountSettingScreen';
import MyProfileScreen from '../screens/dashboard/profile/MyProfileScreen';
import OtherProfileScreen from '../screens/dashboard/profile/OtherProfileScreen';
import AllPhotoScreen from '../screens/dashboard/profile/AllPhotoScreen';
import ChatScreen from '../screens/dashboard/messages/ChatScreen';
import VerifiedCodeScreen from '../screens/auth/VerifiedCodeScreen';
import {firebase} from '@react-native-firebase/analytics';
import {GoogleSignin} from '@react-native-community/google-signin';
import {WEB_CLIENT_ID} from '../config/config';
import SelectInformationScreen from '../screens/dashboard/profile/SelectInformationScreen';
import LoaderComponent from '../components/LoaderComponent';
import SendMySeekerRequestScreen from '../screens/dashboard/seekers/SeekerMyRequestListsScreen';

let Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

enableFontPatch();

const navigationOption = () => {
  return {
    headerShown: false,
    headerBackTitleVisible: false,
    gestureEnabled: false,
  };
};

let appNav = null;

function CommonView() {
    return (
        <>
            <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
            <Stack.Screen name="AllPhotos" component={AllPhotoScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="SeekerDetail" component={SeekerDetailScreen} />
            <Stack.Screen name="SelectionInformation" component={SelectInformationScreen} />
            <Stack.Screen name="WhoLikeMe" component={WhoLikesMeScreen} />
            <Stack.Screen name="SeekerRequest" component={SeekerRequestScreen} />
        </>
    )
}

function HomeStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Home" component={HomeScreen} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function MyProfileStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function PaymentStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="PaymentPackages" component={PaymentPackagesScreen} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        </Stack.Navigator>
    );
}

function MatchesStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Matches" component={MatchesScreen} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function MessagesStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Messages" component={MessagesScreen} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function NotificationStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Notification" component={NotificationsScreen} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function SeekerStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="SeekerList" component={SeekerListsScreen} />
            <Stack.Screen name="SeekerUser" component={SeekerUsersScreen} />
            <Stack.Screen name="SeekerSendRequest" component={SeekerSendRequestScreen} />
            <Stack.Screen name="SendMySeekerRequest" component={SendMySeekerRequestScreen} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function SettingStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Setting" component={SettingsScreen} />
            <Stack.Screen name="AccountSetting" component={AccountSettingScreen} />
        </Stack.Navigator>
    );
}

class AppNavigator extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    appNav = this;
    await firebase.analytics().setAnalyticsCollectionEnabled(true);
    GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
    });
  }

  render() {
    const {user, loading} = this.props;

    if (loading)
      return <SplashScreen />;

    return (
      <NavigationContainer>
          {
            user === null
              ? <Stack.Navigator screenOptions={navigationOption()}>
                  <Stack.Screen name="GetStarted" component={GetStartedScreen}/>
                  <Stack.Screen name="LoginAndRegister" component={LoginAndRegisterScreen}/>
                  <Stack.Screen name="Verification" component={VerificationScreen}/>
                  <Stack.Screen name="RegistrationStep" component={RegistrationStepScreen}/>
                  <Stack.Screen name="AddPhoto" component={AddPhotoScreen}/>
                  <Stack.Screen name="Congratulations" component={CongratulationsScreen}/>
                  <Stack.Screen name="VerifiedCode" component={VerifiedCodeScreen}/>
                </Stack.Navigator>
              : <Drawer.Navigator initialRouteName="Home"
                                  drawerContent={props => <MenuScreen {...props} />}
                                  edgeWidth={0}
                                  screenOptions={navigationOption()}>
                  <Drawer.Screen name="Home" component={HomeStackScreen} />
                  <Drawer.Screen name="MyProfile" component={MyProfileStackScreen} />
                  <Drawer.Screen name="Payments" component={PaymentStackScreen} />
                  <Drawer.Screen name="Matches" component={MatchesStackScreen} />
                  <Drawer.Screen name="Messages" component={MessagesStackScreen} />
                  <Drawer.Screen name="Notifications" component={NotificationStackScreen} />
                  <Drawer.Screen name="Seekers" component={SeekerStackScreen} />
                  <Drawer.Screen name="Settings" component={SettingStackScreen} />
                </Drawer.Navigator>
          }
          <LoaderComponent loading={this.props.showLoader}/>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  user: state.auth.user,
  theme: state.auth.theme,
  showLoader: state.auth.showLoader,
});

export default connect(mapStateToProps)(AppNavigator);
