import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {regex, W_WIDTH} from '../../utils/regex';
import FastImage from 'react-native-fast-image';
import {ONLINE} from '../../themes/constantColors';

class MatchComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {theme, item} = this.props;
        const {user} = item;

        return (
            <View style={[styles.container]}>
                <View style={[styles.innerView, {backgroundColor: theme.textInputBackgroundColor}]}>
                    <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}/>
                    <FastImage source={require('./../../assets/blur_effect.png')} style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 89}}/>
                    <View style={styles.topView}>
                        {/*<View style={styles.matchView}>*/}
                        {/*    <Text style={[styles.matchText, {color: theme.backgroundColor}]}>{item.match}%</Text>*/}
                        {/*</View>*/}
                    </View>
                    <View style={styles.bottomView}>
                        <View style={[styles.bottomNameView]}>
                            {item.online && <View style={styles.onlineView} />}
                            <Text style={[styles.nameText, {color: theme.backgroundColor}]}>{user.name}{regex.getAge(user.DoB)}</Text>
                        </View>
                        {/*<Text style={[styles.locationText, {color: theme.backgroundColor}]}>{user.locationName}</Text>*/}
                    </View>
                </View>
            </View>
        );
    }
}

export default MatchComponent;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        height: 177,
        width: (W_WIDTH/2) - 20,
        overflow: 'hidden'
    },
    innerView: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden'
    },
    topView: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 15,
    },
    matchView: {
      borderRadius: 15,
      backgroundColor: '#9B006770',
      width: 60,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center'
    },
    matchText: {
      fontSize: 14,
      fontWeight: '600',
    },
    bottomView: {
        paddingBottom: 15,
        alignItems: 'center',
    },
    bottomNameView: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    onlineView: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ONLINE,
        marginRight: 5,
    },
    nameText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600'
    },
    locationText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '400'
    }
});
