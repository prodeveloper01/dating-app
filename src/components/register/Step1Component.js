import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CommonTextInput from '../general/CommonTextInput';
import CommonButton from '../general/CommonButton';
import {ASPECT_RATIO, regex, W_WIDTH} from '../../utils/regex';
import * as messages from '../../utils/messages';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class Step1Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.data.name,
            username: props.data.username,
            email: props.data.email,
            socialType: props.data.socialType,
        }
    }

    nextPress = () => {
        const {name, username, email} = this.state;
        const {onPress} = this.props;

        if (regex.isEmpty(name))
            alert(messages.enterFullName);
        else if (regex.isEmpty(username))
            alert(messages.enterUserName);
        else if (!regex.validateUsername(username))
            alert(messages.enterValidUserName);
        else if (regex.isEmpty(email))
            alert(messages.enterEmail);
        else if (!regex.validateEmail(email))
            alert(messages.enterValidEmail);
        else
            onPress(1, {name, username, email});
    };

    render() {
        const {name, username, email, socialType} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <KeyboardAwareScrollView>
                    <View>
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Basic Info'}</Text>
                        <View>
                            <CommonTextInput
                                autoCompleteType={'name'}
                                placeholder={'Full Name'}
                                keyboardType={'default'}
                                value={name}
                                onChangeText={(name)=>this.setState({name})}
                            />
                            <CommonTextInput
                                autoCompleteType={'username'}
                                placeholder={'Username'}
                                keyboardType={'default'}
                                value={username}
                                onChangeText={(username)=>this.setState({username})}
                            />
                            <CommonTextInput
                                autoCompleteType={'email'}
                                placeholder={'Email'}
                                keyboardType={'email-address'}
                                editable={socialType === 'phone'}
                                value={email}
                                onChangeText={(email)=>this.setState({email})}
                            />
                            <CommonButton
                                theme={theme}
                                container={{marginTop: ASPECT_RATIO(123)}}
                                backgroundColor={theme.pinkColor}
                                borderColor={theme.pinkColor}
                                textColor={theme.backgroundColor}
                                title={'Continue'}
                                onPress={this.nextPress}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default Step1Component;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: W_WIDTH
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        fontSize: 26,
        fontWeight: '800'
    },
});
