import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import {HEIGHT_RATIO, regex} from '../../../utils/regex';
import FastImage from 'react-native-fast-image';
import {Icon} from 'react-native-elements';
import CommonButton from '../../../components/general/CommonButton';
import moment from 'moment';
import {updateSeekerRequestStatus} from '../../../actions/seekerAction';
import {distance} from '../../../utils/location';
import {getSeekerTitle} from '../../../actions/generalAction';
import {getAndUpdateNotificationItem} from '../../../actions/notificationsAction';

class SeekerDetailScreen extends Component {

    constructor(props) {
        super(props);
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onRequestStatusPress = (status) => {
        const {navigation, route} = this.props;
        let params = route.params;
        const { seeker_id } = params.item;
        updateSeekerRequestStatus(seeker_id, status);
        getAndUpdateNotificationItem(seeker_id, status);
        if (status === 'declined')
            navigation.goBack();
    };

    render() {
        const {theme, route, location} = this.props;
        let params = route.params;
        const { user, date, address, note, seekerKey, request_status } = params.item;
        const {title} = getSeekerTitle(seekerKey);

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={title} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.innerView]}>
                    <ScrollView showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}>
                        <View style={[styles.innerView, {padding: 20}]}>
                            <View style={[styles.userView, {backgroundColor: theme.secondaryColor}]}>
                                 <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={{width: null, height: HEIGHT_RATIO(.45)}}/>
                                 <FastImage source={require('./../../../assets/seekerphotogradient.png')} style={{width: null, height: HEIGHT_RATIO(.45), position: 'absolute', bottom: 0, left: 0, right: 0}}/>
                                 <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, marginHorizontal: 20, marginBottom: 20}}>
                                     <Text style={{fontSize: 24, color: theme.backgroundColor, fontWeight: '800'}}>{`${user.name}${regex.getAge(user.DoB)}`}</Text>
                                     <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                                         <Icon type={'feather'} name={'map-pin'} size={14} color={theme.backgroundColor} style={{fontSize: 14, color: theme.backgroundColor}}/>
                                         <Text style={[styles.timeText, {color: theme.backgroundColor, marginLeft: 5}]}>{`${distance(user.location, location, 'K')}`} km away</Text>
                                     </View>
                                 </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                                <Icon type={'feather'} name={'calendar'} size={16} color={theme.subPrimaryColor} style={{fontSize: 16, color: theme.subPrimaryColor}}/>
                                <Text style={[styles.timeText, {color: theme.subPrimaryColor}]}> Date & Time: </Text>
                                <Text style={[styles.timeText, {color: theme.primaryColor}]}>{moment.unix(date).local().format('ddd, D MMM YYYY, hh:mm a')}</Text>
                            </View>
                            <View style={{marginTop: 15}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon type={'feather'} name={'map-pin'} size={16} color={theme.subPrimaryColor} style={{fontSize: 16, color: theme.subPrimaryColor}}/>
                                    <Text style={[styles.timeText, {color: theme.subPrimaryColor}]}> Location: </Text>
                                </View>
                                <Text style={[styles.timeText, {marginTop: 5, color: theme.primaryColor}]}>{address}</Text>
                            </View>
                            <View style={{marginTop: 15}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon type={'feather'} name={'file-text'} size={16} color={theme.subPrimaryColor} style={{fontSize: 16, color: theme.subPrimaryColor}}/>
                                    <Text style={[styles.timeText, {color: theme.subPrimaryColor}]}> Note: </Text>
                                </View>
                                <Text style={[styles.timeText, {marginTop: 5, color: theme.primaryColor}]}>{note}</Text>
                            </View>
                            {
                                request_status === '' && <View style={[styles.requestView]}>
                                    <CommonButton
                                        theme={theme}
                                        container={{flex: 1, marginHorizontal: 0, marginRight: 20}}
                                        innerContainer={{borderRadius: 5, paddingVertical: 13}}
                                        backgroundColor={theme.backgroundColor}
                                        borderColor={theme.borderColor}
                                        textColor={theme.primaryColor}
                                        title={'Decline'}
                                        onPress={() => this.onRequestStatusPress('declined')}
                                    />
                                    <CommonButton
                                        theme={theme}
                                        container={{flex: 1, marginHorizontal: 0}}
                                        innerContainer={{borderRadius: 5, paddingVertical: 13}}
                                        backgroundColor={theme.pinkColor}
                                        borderColor={theme.pinkColor}
                                        textColor={theme.backgroundColor}
                                        title={'Accept'}
                                        onPress={() => this.onRequestStatusPress('accepted')}
                                    />
                                </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    location: state.auth.location,
});

export default connect(mapStateToProps)(SeekerDetailScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerView: {
        flex: 1,
    },
    userView: {
        height: HEIGHT_RATIO(.45),
        borderRadius: 5,
        overflow: 'hidden',
    },
    requestView: {
        flexDirection: 'row',
        marginVertical: 5,
        marginBottom: 15
    },
    timeText: {
        fontSize: 14,
        fontWeight: '400'
    },
});
