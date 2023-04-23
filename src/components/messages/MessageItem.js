import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Day, SystemMessage} from 'react-native-gifted-chat';
import {isSameUser} from 'react-native-gifted-chat/lib/utils';
import MessageBubble from './MessageBubble';

const styles = {
    left: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            marginLeft: 8,
            marginRight: 0,
        },
    }),
    right: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginLeft: 0,
            marginRight: 8,
        },
    }),
};

export default class Message extends React.Component {

    renderDay() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const { containerStyle, ...props } = this.props;
            if (this.props.renderDay) {
                return this.props.renderDay(props);
            }
            return <Day {...props}/>;
        }
        return null;
    }

    renderBubble() {
        const { containerStyle, theme , ...props } = this.props;
        if (this.props.renderBubble) {
            return this.props.renderBubble(props);
        }
        // @ts-ignore
        return <MessageBubble theme={theme} {...props}/>;
    }

    renderSystemMessage() {
        const { containerStyle, ...props } = this.props;
        if (this.props.renderSystemMessage) {
            return this.props.renderSystemMessage(props);
        }
        return <SystemMessage {...props}/>;
    }

    renderAvatar() {
        const { user, currentMessage, showUserAvatar } = this.props;
        if (user &&
            user._id &&
            currentMessage &&
            currentMessage.user &&
            user._id === currentMessage.user._id &&
            !showUserAvatar) {
            return null;
        }
        if (currentMessage &&
            currentMessage.user &&
            currentMessage.user.avatar === null) {
            return null;
        }
        const { containerStyle, ...props } = this.props;
        return <Avatar {...props}/>;
    }

    render() {
        const { currentMessage, nextMessage, position, containerStyle } = this.props;
        if (currentMessage) {
            const sameUser = isSameUser(currentMessage, nextMessage);
            return (<View>
                {this.renderDay()}
                {currentMessage.system ? (this.renderSystemMessage()) : (<View style={[
                    styles[position].container,
                    { marginBottom: sameUser ? 2 : 10 },
                    !this.props.inverted && { marginBottom: 2 },
                    containerStyle && containerStyle[position],
                ]}>
                    {this.props.position === 'left' ? this.renderAvatar() : null}
                    {this.renderBubble()}
                    {this.props.position === 'right' ? this.renderAvatar() : null}
                </View>)}
            </View>);
        }
        return null;
    }
}
