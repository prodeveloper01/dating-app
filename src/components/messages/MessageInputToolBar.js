import React from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {Actions, Composer, Send} from 'react-native-gifted-chat';
import {regex} from '../../utils/regex';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 10,
        paddingBottom: 10
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    accessory: {
        height: 43,
    },
});

export default class MessageInputToolBar extends React.Component {

    state = {
        position: 'absolute',
    };

    keyboardWillShowListener = undefined;
    keyboardWillHideListener = undefined;

    componentWillMount() {
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow,
        );
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide,
        )
    }

    componentWillUnmount() {
        if (this.keyboardWillShowListener) {
            this.keyboardWillShowListener.remove()
        }
        if (this.keyboardWillHideListener) {
            this.keyboardWillHideListener.remove()
        }
    }

    keyboardWillShow = () => {
        if (this.state.position !== 'relative') {
            this.setState({
                position: 'relative',
            })
        }
    };

    keyboardWillHide = () => {
        if (this.state.position !== 'absolute') {
            this.setState({
                position: 'absolute',
            })
        }
    };

    renderActions() {
        const { containerStyle, ...props } = this.props;
        if (this.props.renderActions) {
            return this.props.renderActions(props)
        } else if (this.props.onPressActionButton) {
            return <Actions {...props} />
        }
        return null
    }

    renderSend() {
        if (this.props.renderSend) {
            return this.props.renderSend(this.props)
        }
        return <Send {...this.props}
                     containerStyle={{alignItems: 'center'}}
                     alwaysShowSend={false}
                     label={'Send'}/>
    }

    renderComposer() {
        if (this.props.renderComposer) {
            return this.props.renderComposer(this.props)
        }

        return <Composer {...this.props} />
    }

    renderAccessory() {
        if (this.props.renderAccessory) {
            const {replyItem} = this.props;

            let height = 0;
            if (!regex.isEmpty(replyItem))
                height = 43;

            return (
                <View style={[{height: height}, this.props.accessoryStyle]}>
                    {this.props.renderAccessory(this.props)}
                </View>
            )
        }
        return null
    }

    render() {
        let {theme} = this.props;

        return (
            <View
                style={
                    [
                        styles.container,
                        this.props.containerStyle,
                        { position: this.state.position },
                    ]
                }
            >
                <View style={{
                    backgroundColor: theme.container.backgroundColor,
                    marginLeft: 10,
                    marginRight: 10,
                    paddingLeft: 5,
                    paddingRight: 5,
                }}>
                    {this.renderAccessory()}
                    <View style={[styles.primary, this.props.primaryStyle]}>
                        {this.renderActions()}
                        {this.renderComposer()}
                        {this.renderSend()}
                    </View>
                </View>
            </View>
        )
    }
}
