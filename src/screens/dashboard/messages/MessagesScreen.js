import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import HeaderComponent from '../../../components/general/HeaderComponent';
import MessagesComponent from '../../../components/messages/MessagesComponent';
import {PINK} from '../../../themes/constantColors';
import {TouchableFeedback} from '../../../utils/regex';
import {getAllConversationLists} from '../../../actions/conversationsAction';
import {getSeekerRequestLists} from '../../../actions/seekerAction';
import {getWhoLikedMeLists} from '../../../actions/swipeCardAction';

class MessagesScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        getAllConversationLists(this.props.user.uid);
        getSeekerRequestLists(this.props.user.uid);
        getWhoLikedMeLists(this.props.user.uid)
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onRightPress = () => {

    };

    toggleSwitch = (value) => {

    };

    renderHeader = () => {
        const {theme, navigation, seekerUnreadCount, whoLikedUnreadCount} = this.props;
        return <View>
            {/*<View style={[styles.rowView, {borderRadius: 15, paddingVertical: 15, borderBottomWidth: 0, backgroundColor: '#FD353920', paddingHorizontal: 25}]}>*/}
            {/*    <Text style={[styles.headText, {color: theme.primaryColor}]}>Available for video call</Text>*/}
            {/*    <Switch*/}
            {/*        trackColor={{ false: theme.subPrimaryColor, true: theme.pinkColor }}*/}
            {/*        thumbColor={White}*/}
            {/*        ios_backgroundColor={'transparent'}*/}
            {/*        onValueChange={this.toggleSwitch}*/}
            {/*        value={true}*/}
            {/*    />*/}
            {/*</View>*/}
            <TouchableFeedback onPress={() => navigation.navigate('SeekerRequest')}>
                <View style={[styles.rowView, {borderColor: theme.borderColor}]}>
                    <Text style={[styles.headText, {color: theme.primaryColor}]}>Seekers Requests</Text>
                    <View style={[{flexDirection: 'row', alignItems: 'center',}]}>
                        {
                            seekerUnreadCount > 0 && <View style={styles.countView}>
                                <Text style={[styles.countText, {color: theme.backgroundColor}]}>{seekerUnreadCount}</Text>
                            </View>
                        }
                        <Icon type={'feather'} name={'chevron-right'} color={theme.subSecondaryColor} style={{color: theme.subSecondaryColor}} />
                    </View>
                </View>
            </TouchableFeedback>
            <TouchableFeedback onPress={() => navigation.navigate('WhoLikeMe')}>
                <View style={[styles.rowView, {borderBottomWidth: 0}]}>
                    <Text style={[styles.headText, {color: theme.primaryColor}]}>Who Likes Me</Text>
                    <View style={[{flexDirection: 'row', alignItems: 'center',}]}>
                        {
                            whoLikedUnreadCount > 0 && <View style={styles.countView}>
                                <Text style={[styles.countText, {color: theme.backgroundColor}]}>{whoLikedUnreadCount}</Text>
                            </View>
                        }
                        <Icon type={'feather'} name={'chevron-right'} color={theme.subSecondaryColor} style={{color: theme.subSecondaryColor}} />
                    </View>
                </View>
            </TouchableFeedback>
            <Text style={[styles.titleText, {color: theme.primaryColor}]}>Messages</Text>
        </View>
    };

    render() {
        const {theme, navigation, conversations, user} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Messages'} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={conversations}
                        extraData={conversations}
                        ListHeaderComponent={this.renderHeader}
                        renderItem={({item}) => <MessagesComponent uid={user.uid} theme={theme} item={item} navigation={navigation}/> }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    conversations: state.auth.conversations,
    seekerUnreadCount: state.auth.seekerUnreadCount,
    whoLikedUnreadCount: state.auth.whoLikedUnreadCount,
});

export default connect(mapStateToProps)(MessagesScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        paddingVertical: 10
    },
    headText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '400',
    },
    countView: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        backgroundColor: PINK,
        borderRadius: 15
    },
    countText: {
        fontSize: 14,
        fontWeight: '800'
    },
    titleText: {
        marginHorizontal: 20,
        marginVertical: 10,
        fontSize: 32,
        fontWeight: '800'
    }
});
