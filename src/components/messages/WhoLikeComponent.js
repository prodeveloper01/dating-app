import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {regex} from '../../utils/regex';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

class WhoLikeComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {theme, item} = this.props;
        const {user} = item;

        return (
            <View style={[styles.container, {borderColor: theme.borderColor}]}>
                <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={{width: 56, height: 56, borderRadius: 28}}/>
                <View style={[styles.infoView]}>
                    <View style={[styles.nameView]}>
                        <Text style={[styles.nameText, {color: theme.primaryColor}]}>{user.name}{regex.getAge(user.DoB)}</Text>
                        <Text style={[styles.likeText, {color: theme.secondaryColor}]}>{'Liked your profile'}</Text>
                        <Text style={[styles.timeText, {color: theme.subSecondaryColor}]}>{moment.unix(item.createdAt).local().fromNow(true)}</Text>
                    </View>
                    <FastImage source={require('./../../assets/heart.png')} style={{width: 22, height: 20}}/>
                </View>
            </View>
        );
    }
}

export default WhoLikeComponent;

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
    timeText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '400'
    }
});
