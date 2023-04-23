import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {regex, TouchableFeedback} from '../../utils/regex';
import FastImage from 'react-native-fast-image';
import CommonButton from '../general/CommonButton';
import {deleteSeekerRequest, updateSeekerRequestStatus} from '../../actions/seekerAction';
import {getAndUpdateNotificationItem} from '../../actions/notificationsAction';

class SeekerRequestComponent extends Component {

    constructor(props) {
        super(props);
    }

    onRequestStatusPress = (status) => {
        const {item} = this.props;
        const {seeker_id} = item;
        updateSeekerRequestStatus(seeker_id, status);
        getAndUpdateNotificationItem(seeker_id, status);
    };

    onCancelPress = () => {
        const {item} = this.props;
        const {seeker_id} = item;
        deleteSeekerRequest(seeker_id);
    };

    onChat = () => {
        const {item, navigation, type} = this.props;
        navigation.navigate('ChatScreen', {conversation: item, type: 'seeker'});
    };

    onCardPress = () => {
        const {item, navigation, type} = this.props;

        if (type === 'my')
            return;

        navigation.navigate('SeekerDetail', {item})
    };

    render() {
        const {theme, item, type} = this.props;
        const {user, request_status} = item;

        return (
            <TouchableFeedback onPress={this.onCardPress}>
                <View style={[styles.container, {borderColor: theme.borderColor}]}>
                    <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={{width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: theme.borderColor}}/>
                    <View style={[styles.infoView]}>
                        <View style={[styles.nameView]}>
                            <Text style={[styles.nameText, {color: theme.primaryColor}]}>{`${user.name}${regex.getAge(user.DoB)}`}</Text>
                            <Text style={[styles.likeText, {color: theme.subPrimaryColor}]}>{'Sent you a request'}</Text>
                            {
                                request_status === '' && type === 'others'
                                    ? <View style={[styles.requestView]}>
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
                                    : request_status === 'accepted' && (type === 'others' || type === 'my')
                                    ? <View style={[styles.requestView]}>
                                        <CommonButton
                                            theme={theme}
                                            container={{flex: 1, marginHorizontal: 0, marginRight: 20}}
                                            innerContainer={{borderRadius: 5, paddingVertical: 8, width: 100}}
                                            backgroundColor={theme.backgroundColor}
                                            borderColor={theme.borderColor}
                                            textColor={theme.primaryColor}
                                            title={'Chat'}
                                            onPress={this.onChat}
                                        />
                                    </View>
                                    : request_status === '' && type === 'my'
                                    && <View style={[styles.requestView]}>
                                        <CommonButton
                                            theme={theme}
                                            container={{flex: 1, marginHorizontal: 0, marginRight: 20}}
                                            innerContainer={{borderRadius: 5, paddingVertical: 8, width: 100}}
                                            backgroundColor={theme.backgroundColor}
                                            borderColor={theme.borderColor}
                                            textColor={theme.primaryColor}
                                            title={'Cancel'}
                                            onPress={this.onCancelPress}
                                        />
                                    </View>
                            }
                        </View>
                    </View>
                </View>
            </TouchableFeedback>
        );
    }
}

export default SeekerRequestComponent;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 20,
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
        fontSize: 14,
        fontWeight: '400'
    },
    requestView: {
        flexDirection: 'row',
        marginTop: 10
    }
});
