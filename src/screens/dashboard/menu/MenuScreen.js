import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {ASPECT_RATIO, regex, shadow, TouchableFeedback} from '../../../utils/regex';
import CommonButton from '../../../components/general/CommonButton';

class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    id: 1,
                    title: 'My Membership',
                    count: 0,
                },
                {
                    id: 2,
                    title: 'Matches',
                    count: 0,
                },
                {
                    id: 3,
                    title: 'Messages',
                    count: 0,
                },
                {
                    id: 4,
                    title: 'Notifications',
                    count: 0,
                },
                {
                    id: 5,
                    title: 'Seekers',
                    count: 0,
                },
                {
                    id: 6,
                    title: 'Invite Friends',
                    count: 0,
                },
                // {
                //     id: 7,
                //     title: 'Language (s)',
                //     count: 0,
                // },
                {
                    id: 8,
                    title: 'Terms and Conditions',
                    count: 0,
                },
                {
                    id: 9,
                    title: 'Settings',
                    count: 0,
                },
                {
                    id: 10,
                    title: 'Logout',
                    count: 0,
                }
            ]
        }
    }

    onItemPress = (item) => {
        const {navigation} = this.props;
        if (item.id !== 10)
            navigation.closeDrawer();

        if (item.id === 1) {
            navigation.navigate('Payments');
        } else if (item.id === 2) {
            navigation.navigate('Matches');
        } else if (item.id === 3) {
            navigation.navigate('Messages');
        } else if (item.id === 4) {
            navigation.navigate('Notifications');
        } else if (item.id === 5) {
            navigation.navigate('Seekers');
        } else if (item.id === 6) {

        } else if (item.id === 7) {

        } else if (item.id === 8) {

        } else if (item.id === 9) {
            navigation.navigate('Settings');
        } else if (item.id === 10) {
            regex.logout(navigation);
        }
    };

    renderItem = ({ item, index }) => {
        const {theme, user, notificationCount, conversationCount} = this.props;

        let count = 0;
        if (item.id === 1)
           count = regex.getDayLeft(user.packageEndDate);
        else if (item.id === 3)
            count = conversationCount;
        else if (item.id === 4)
           count = notificationCount;

        return <TouchableFeedback onPress={()=>this.onItemPress(item)}>
            <View style={{flexDirection: 'row', paddingVertical: 15, alignItems: 'center',}}>
                <Text style={{fontSize: 16, color: '#333333', fontWeight: '400'}}>{item.title}</Text>
                {
                    index === 0 && count > 0
                        ? <Text style={{marginLeft: 10, fontSize: 14, color: theme.pinkColor, fontWeight: '800'}}>{count} days left</Text>
                        : count > 0 && <View style={{marginLeft: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: theme.pinkColor}}>
                        <Text style={{fontSize: 14, color: theme.backgroundColor, fontWeight: '800'}}></Text>
                    </View>
                }
            </View>
        </TouchableFeedback>
    };

    renderHeader = () => {
        const {user, theme, navigation} = this.props;

        return (
            <View style={{marginTop: ASPECT_RATIO(45)}}>
                <View style={[styles.imageView, {...shadow(5)}]}>
                    <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={[styles.imageView]}/>
                </View>
                <Text style={[styles.nameText, {color: theme.primaryColor}]}>{`${user.name}${regex.getAge(user.DoB)}`}</Text>
                <CommonButton
                    theme={theme}
                    container={{marginTop: 10, marginBottom: 20, marginHorizontal: 0, width: 120}}
                    innerContainer={{paddingVertical: 10}}
                    backgroundColor={theme.primaryColor}
                    borderColor={theme.primaryColor}
                    textColor={theme.backgroundColor}
                    title={'My Profile'}
                    onPress={() => navigation.navigate('MyProfile')}
                />
            </View>
        )
    };

    render() {
        const {data} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <View style={[styles.innerView]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={data}
                        extraData={data}
                        ListHeaderComponent={this.renderHeader}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    notificationCount: state.auth.notificationCount,
    conversationCount: state.auth.conversationCount,
});

export default connect(mapStateToProps)(MenuScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerView: {
        flex: 1,
        marginHorizontal: 20,
    },
    imageView: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    nameText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '500',
    }
});
