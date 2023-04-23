import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Icon} from 'react-native-elements';
import CommonButton from '../general/CommonButton';
import {regex, TouchableFeedback} from '../../utils/regex';
import {getSeekerTitle} from '../../actions/generalAction';
import moment from 'moment';
import {updateSeekerRequestStatus} from '../../actions/seekerAction';
import {updateNotificationStatus} from '../../actions/notificationsAction';

class NotificationComponent extends Component {

    constructor(props) {
        super(props);
    }

    onRequestStatusPress = (status) => {
        const {item, refreshData} = this.props;
        const {relationship_id, id} = item;
        updateSeekerRequestStatus(relationship_id, status);
        updateNotificationStatus(id, status);
        refreshData();
    };

    renderItem = () => {
        const {theme, item} = this.props;
        const {user, notification_type, seekerKey, address, createdAt, request_status} = item;

        if (notification_type === 'matches') {
            return <View style={[styles.nameView]}>
                <Text style={[styles.likeText, {color: theme.secondaryColor}]}>Congratulations!, You match with
                    <Text style={[styles.nameText, {color: theme.primaryColor}]}>{` ${user.name}`}</Text>
                </Text>
                <Text style={[styles.timeText, {color: theme.subSecondaryColor, marginTop: 8}]}>{moment.unix(createdAt).local().fromNow(true)}</Text>
            </View>
        }

        let getSubTitle = ` Sent you a ${getSeekerTitle(seekerKey).title.toLowerCase()} request`;
        return <View style={[styles.nameView]}>
            <Text style={[styles.nameText, {color: theme.primaryColor}]}>{`${user.name}${regex.getAge(user.DoB)}`}
                <Text style={[styles.likeText, {color: theme.secondaryColor}]}>{getSubTitle}</Text>
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                <Icon type={'feather'} name={'map-pin'} size={14} color={theme.subPrimaryColor}/>
                <Text style={[styles.timeText, {color: theme.subSecondaryColor, marginLeft: 5}]}>{address}</Text>
            </View>
            {
                request_status === '' && <View style={[styles.requestView]}>
                    <CommonButton
                        theme={theme}
                        container={{flex: 1, marginHorizontal: 0, marginRight: 20}}
                        innerContainer={{borderRadius: 5, paddingVertical: 8}}
                        backgroundColor={theme.backgroundColor}
                        borderColor={theme.borderColor}
                        textColor={theme.primaryColor}
                        title={'Decline'}
                        onPress={() => this.onRequestStatusPress('declined')}
                    />
                    <CommonButton
                        theme={theme}
                        container={{flex: 1, marginHorizontal: 0, marginRight: 20}}
                        innerContainer={{borderRadius: 5, paddingVertical: 8}}
                        backgroundColor={theme.pinkColor}
                        borderColor={theme.pinkColor}
                        textColor={theme.backgroundColor}
                        title={'Accept'}
                        onPress={() => this.onRequestStatusPress('accepted')}
                    />
                </View>
            }
            <Text style={[styles.timeText, {color: theme.subSecondaryColor}]}>{moment.unix(createdAt).local().fromNow(true)}</Text>
        </View>
    };

    render() {
        const {theme, item, navigation} = this.props;
        const {user} = item;

        return (
            <TouchableFeedback onPress={() => navigation.navigate('OtherProfile', {profileData: user})}>
                <View style={[styles.container, {borderColor: theme.borderColor}]}>
                    <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={{width: 56, height: 56, borderRadius: 28}}/>
                    <View style={[styles.infoView]}>
                        {this.renderItem()}
                    </View>
                </View>
            </TouchableFeedback>
        );
    }
}

export default NotificationComponent;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        paddingVertical: 15,
    },
    infoView: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
    },
    nameView: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600'
    },
    likeText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '400'
    },
    timeText: {
        fontSize: 14,
        fontWeight: '400'
    },
    requestView: {
        flexDirection: 'row',
        marginVertical: 5,
        marginBottom: 10
    }
});
