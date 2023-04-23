import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Composer, GiftedChat, Send} from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import MessageInputToolBar from '../../../components/messages/MessageInputToolBar';
import {Header, Icon} from 'react-native-elements';
import {Header_Height, regex, W_WIDTH} from '../../../utils/regex';
import MessageItem from '../../../components/messages/MessageItem';
import FastImage from 'react-native-fast-image';
import {PINK} from '../../../themes/constantColors';
import {addMessageInSeeker, updateLatestMessageInSeeker} from '../../../actions/seekerAction';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {assetUploadInCloudinaryServer} from '../../../actions/cloudinaryStorageAction';
import {
    addMessageInConversation,
    readMessageInConversation,
    updateLatestMessageInConversation,
} from '../../../actions/conversationsAction';
import Video from 'react-native-video';
import {conversationsCollection, seekerRequestCollection} from '../../../config/firestore';
import {setFormatAsPerGiftedChatArray} from '../../../actions/generalAction';

class ChatScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: [],
            replyItem: null
        }
    }

    componentDidMount() {
        this.getData();
        this.readConversation();
    }

    getDataFromSeeker = () => {
        const {seeker_id, user} = this.getConversationData();
        this.getAllMessagesFromSeeker(seeker_id, user);
    };

    getAllMessagesFromSeeker = (seekerId, otherUser) => {
        seekerRequestCollection
            .doc(seekerId)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(response => {
                let messages = setFormatAsPerGiftedChatArray(response, otherUser);
                this.setState({messages})
            });
    };

    getDataFromConversation = () => {
        const {matches_id, user} = this.getConversationData();
        this.getAllMessageListsFromConversation(matches_id, user);
    };

    getAllMessageListsFromConversation = (conversationId, otherUser) => {
        conversationsCollection
            .doc(conversationId)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(response => {
                let messages = setFormatAsPerGiftedChatArray(response, otherUser);
                this.setState({messages})
            });
    };

    getData = () => {
        if (this.getType() === 'seeker')
            this.getDataFromSeeker();
        else
            this.getDataFromConversation();
    };

    readConversation = () => {
        if (this.getType() === 'seeker') {

        } else {
            const {matches_id} = this.getConversationData();
            readMessageInConversation(matches_id, this.props.user.uid);
        }
    };

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
        if (this.getType() === 'seeker') {
            const {seeker_id} = this.getConversationData();
            if (messages.length > 0) {
                let parameter = messages[0];
                parameter.messageType = 'text';
                this.uploadDataInFirestore(seeker_id, parameter);
            }
        } else  {
            const {matches_id} = this.getConversationData();
            if (messages.length > 0) {
                let parameter = messages[0];
                parameter.messageType = 'text';
                this.uploadDataInFirestore(matches_id, parameter);
            }
        }
    }

    uploadImage = (media) => {
        let uploadPhotos = [];
        media.forEach((file) => {
            uploadPhotos.push(assetUploadInCloudinaryServer(file, true));
        });

        Promise.all(uploadPhotos).then(response => {
            response.forEach(({data, photo}) => {
                if (Boolean(data.public_id)) {
                    let parameter = {
                        media_id: data.public_id,
                        user: {
                            _id: this.props.user.uid
                        }
                    };
                    if (photo.mime.includes('image')) {
                        parameter.messageType = 'image';
                        parameter.image = data.secure_url;
                    } else {
                        parameter.messageType = 'video';
                        parameter.video = data.secure_url;
                    }
                    if (this.getType() === 'seeker') {
                        const {seeker_id} = this.getConversationData();
                        this.uploadDataInFirestore(seeker_id, parameter);
                    } else {
                        const {matches_id} = this.getConversationData();
                        this.uploadDataInFirestore(matches_id, parameter);
                    }
                }
            });
        })
    };

    uploadDataInFirestore = (id, parameter) => {
        if (this.getType() === 'seeker') {
            updateLatestMessageInSeeker(id, parameter);
            addMessageInSeeker(id, parameter);
        } else  {
            updateLatestMessageInConversation(id, parameter);
            addMessageInConversation(id, parameter);
        }
    };

    onAttachmentPress = () => {
        this.ActionSheet.show()
    };

    openGallery = () => {
        ImagePicker.openPicker({}).then(image => {
            this.uploadImage([image]);
        });
    };

    openCamera = () => {
        ImagePicker.openCamera({
            cropping: true
        }).then(image => {
            this.uploadImage([image]);
        });
    };

    onActionIndexPress = (index) => {
        if (index === 0)
            this.openGallery();
        else if (index === 1)
            this.openCamera();
    };

    getType = () => {
        const {route} = this.props;
        let params = route.params;
        return params.type;
    };

    getConversationData = () => {
        const {route} = this.props;
        let params = route.params;
        return params.conversation;
    };

    userTyping(text)
    {
        this.setState({message: text});
    }

    backPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    profilePress = () => {
        const {navigation} = this.props;
        navigation.navigate('Profile');
    };

    renderNavHeader = () => {
        const {theme} = this.props;
        const {user} = this.getConversationData();

        return (
            <Header containerStyle={styles.header} backgroundColor={'transparent'}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                        <TouchableWithoutFeedback onPress={this.backPress}>
                            <View style={{width: 40, height: 40}}>
                                <Icon type={'feather'} name="chevron-left" size={35} color={theme.primaryColor} style={{color: theme.primaryColor, fontSize: 35}} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.profilePress}>
                            <FastImage style={{width: 40, height: 40, borderRadius: 20}} source={{uri: regex.getProfilePic(user.photos)}}/>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.profilePress}>
                            <View>
                                <Text style={[{marginLeft: 10,fontSize: 14, fontWeight: '800', color: theme.primaryColor}]}>{user.name}</Text>
                                <Text style={[{marginLeft: 10,fontSize: 12, fontWeight: '400', color: theme.subPrimaryColor}]}>{user.online ? 'Active Now' : ''}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Header>
        )
    };

    renderToolbar = (props) => {
        const {theme} = this.props;

        let block_user = 0;
        let block_by = '';
        let name = 'Jonhy';

        if (block_user === 1 && block_by !== '') {
            return (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 13, fontWeight: '600'}}>{`You blocked ${name}.`}</Text>
                    <Text style={{marginLeft: 5, fontSize: 13, fontWeight: '600', color: 'rgb(19,162,234)'}}>Delete chat.</Text>
                </View>
            )
        }

        return (<MessageInputToolBar theme={theme} {...props} replyItem={this.state.replyItem} />)
    };

    renderActions = (props) => {
        const {theme} = this.props;

        return (
            <View style={{height: 45, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableWithoutFeedback onPress={this.onAttachmentPress}>
                    <View style={{width: 40, height: 45, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type={'feather'} name={'paperclip'} size={22} color={theme.primaryColor} style={{color: theme.primaryColor, fontSize: 22}}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    };

    renderSend(props) {
        return (
            <Send {...props}>
                <View style={{marginRight: 10, marginBottom: 10}}>
                    <Icon type={'feather'} name={'send'} size={28} color={PINK} style={{color: PINK, fontSize: 28}}/>
                </View>
            </Send>
        );
    }

    renderComposer = (props) => {
        return (<Composer {...props} textInputStyle={{justifyContent: 'center', paddingTop:8}}/>)
    };

    renderAccessory = (props) => {
        const {replyItem} = this.state;

        if (regex.isEmpty(replyItem))
            return null;

        let tag = 'yourself';
        let text = 'text';

        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
                    <Text style={{fontSize: 13, fontWeight: '500'}}>{`Replying to ${tag}`}</Text>
                    <Text style={{fontSize: 12, fontWeight: '400', color: 'gray', marginTop: 1}} numberOfLines={1}>{text}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type={'feather'} name={'x'} size={35} color={"#000"} style={{color: "#000", fontSize: 35}}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    };

    renderMessage(props) {
        const {theme} = this.props;
        return (<MessageItem theme={theme} {...props} />);
    }

    renderMessageVideo(props) {
        let currentMessage = props.currentMessage;

        return <View style={{backgroundColor: props.theme.pinkColor, borderRadius: 15}}>
            <Video
                ref={r => {this.player = r;}}
                source={{uri: currentMessage.video}}
                style={{width: 200, height: 200, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
                resizeMode={'cover'}
                paused={true}
                controls={true}
            />
        </View>
    };

    render() {
        const {theme, user} = this.props;
        const {messages, replyItem} = this.state;
        let minInputToolbarHeight = regex.isEmpty(replyItem) ? 30 : 50;

        return (
            <View style={[
                styles.container,
                {backgroundColor: theme.container.backgroundColor},
            ]}>
                {this.renderNavHeader()}
                <GiftedChat
                    ref={ref => this.chatRef = ref}
                    // Bottom toolbar
                    renderInputToolbar={this.renderToolbar}
                    renderActions={this.renderActions}
                    renderSend={this.renderSend}
                    renderComposer={this.renderComposer}
                    renderAccessory={this.renderAccessory}
                    minInputToolbarHeight={minInputToolbarHeight}
                    // Message Component
                    renderMessage={this.renderMessage.bind(this)}
                    renderMessageVideo={this.renderMessageVideo.bind(this)}

                    // Others
                    placeholder={'Write something...'}
                    onInputTextChanged={(text) => this.userTyping(text)}
                    onSend={messages => this.onSend(messages)}

                    messages={messages}
                    user={{_id: user.uid}}
                />
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Share Picture'}
                    options={['Gallery', 'Camera', 'cancel']}
                    cancelButtonIndex={2}
                    onPress={this.onActionIndexPress}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
});

export default connect(mapStateToProps)(ChatScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingLeft: 0,
        paddingRight: 0,
        height: Header_Height,
        width: W_WIDTH,
    }
});
