import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {regex, TouchableFeedback} from '../../utils/regex';
import FastImage from 'react-native-fast-image';
import {ONLINE, PINK, White} from '../../themes/constantColors';
import moment from 'moment';

class MessagesComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {theme, item, navigation, uid} = this.props;
        const {user, latestMessage} = item;
        const {text, createdAt} = latestMessage;

        let checkRead = Boolean(item[uid]) ? (item[uid] < createdAt) : true;
        return (
            <TouchableFeedback onPress={() => navigation.navigate('ChatScreen', {conversation: item, type: 'messages'})}>
                <View style={[styles.container]}>
                    <View style={styles.rowView}>
                        <View style={styles.profileView}>
                            <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={{width: 46, height: 46, borderRadius: 23}}/>
                            <View style={[styles.onlineView, {backgroundColor: user.online ? ONLINE : theme.subSecondaryColor}]} />
                        </View>
                        <View style={[styles.textView, {borderColor: theme.borderColor}]}>
                            <View style={[styles.innerRowView]}>
                                <Text style={[styles.nameText, {color: theme.secondaryColor}]}>{user.name}</Text>
                                <Text style={[styles.timeText, {color: theme.secondaryColor}]}>{moment.unix(createdAt).local().fromNow(true)}</Text>
                            </View>
                            <View style={[styles.innerRowView, {marginTop: 5}]}>
                                <Text style={[styles.messageText, {fontWeight: checkRead ? '500' : '400', color: theme.primaryColor}]}>{text}</Text>
                                {checkRead && <View style={styles.readView}/>}
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableFeedback>
        );
    }
}

export default MessagesComponent;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    rowView: {
       flexDirection: 'row',
    },
    profileView: {
       paddingVertical: 15,
    },
    onlineView: {
        position: 'absolute',
        left: 2,
        top: 13,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: White,
        backgroundColor: ONLINE,
        marginRight: 5,
    },
    textView: {
        flex: 1,
        marginLeft: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    innerRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 16,
        fontWeight: '400'
    },
    messageText: {
        fontSize: 16,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '400'
    },
    readView: {
        marginLeft: 10,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: PINK,
    }
});
