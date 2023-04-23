import React, {Component, createRef} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../components/general/HeaderComponent';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import {Black, White} from '../../themes/constantColors';
import {ASPECT_RATIO, regex, shadow, W_WIDTH} from '../../utils/regex';
import CommonButton from '../../components/general/CommonButton';
import * as messages from '../../utils/messages';
import {getUserDataAndUpdateInFirestore} from '../../actions/userAction';

class VerificationScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    nextPress = () => {
        const {value} = this.state;
        const {navigation, route} = this.props;
        let params = route.params;

        if (regex.isEmpty(value))
            alert(messages.enterVerifyOtp);
        else {
            let confirmResult = params.confirmResult;

            if (value.length === 6) {
                regex.showLoader();
                confirmResult.confirm(value).then(response => {
                    getUserDataAndUpdateInFirestore(response).then(response => {
                        regex.hideLoader();
                        this.checkUserData(response);
                    });
                }).catch(error => {
                    regex.hideLoader();
                    alert(error.message);
                })
            } else
                alert('Please enter a 6 digit OTP code.');
        }
    };

    checkUserData = (response) => {
        const {navigation} = this.props;
        let user = response.user;

        if (user.stepCompleted > 8) { // Dashboard
            regex.setDashboard({token: user.uid, ...user})
        } else if (user.stepCompleted === 8) { // Profile step Remaining
            navigation.navigate('AddPhoto', {data: user});
        } else // Register step remaining
            navigation.navigate('RegistrationStep', {...user});
    };

    sendCodeAgainPress = () => {
        this.onBackPress();
    };

    onChangeText = code => {
        this.setState({value: code});
    };

    field = createRef();

    render() {
        const {value} = this.state;
        const {theme, navigation, route} = this.props;
        let params = route.params;
        let phone_number = params.phone_number;
        let callingCode = params.callingCode;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent theme onLeftPress={this.onBackPress}/>
                <ScrollView contentContainerStyle={styles.container}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Enter verification code'}</Text>
                            <Text style={[styles.subTitleText, {color: theme.subPrimaryColor}]}>
                                <Text>We sent an</Text>
                                <Text style={{color: theme.primaryColor}}> SMS </Text>
                                <Text>with a code  to verify your phone number</Text>
                            </Text>
                            <Text style={[styles.subTitleText, {color: theme.primaryColor}]}>{`+${callingCode[0]} ${phone_number}`}</Text>
                            <CodeField
                                value={value}
                                onChangeText={this.onChangeText}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFiledRoot}
                                keyboardType="number-pad"
                                renderCell={({index, symbol, isFocused}) => (
                                    <View
                                        key={index}
                                        style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                        <Text style={[styles.cellText, {color: theme.primaryColor}]}>
                                            {symbol || (isFocused ? <Cursor /> : null)}
                                        </Text>
                                    </View>
                                )}
                            />
                            <CommonButton
                                theme={theme}
                                container={{marginTop: ASPECT_RATIO(45)}}
                                backgroundColor={theme.pinkColor}
                                borderColor={theme.pinkColor}
                                textColor={theme.backgroundColor}
                                title={'Next'}
                                onPress={this.nextPress}
                            />
                            <CommonButton
                                theme={theme}
                                container={{marginTop: ASPECT_RATIO(10)}}
                                backgroundColor={'transparent'}
                                borderColor={'transparent'}
                                textColor={theme.pinkColor}
                                title={`I did't get Code`}
                                onPress={this.sendCodeAgainPress}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(VerificationScreen);

const CELL_COUNT = 6;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    subTitleText: {
        marginHorizontal: 40,
        marginVertical: 15,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
    },
    codeFiledRoot: {
        marginTop: 20,
        width: W_WIDTH - 60,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cellRoot: {
        width: 45,
        height: 45,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: White,
        ...shadow(4)
    },
    cellText: {
        color: Black,
        fontSize: 16,
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: Black,
        borderBottomWidth: 0,
    },
    resentText: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
    },
    timeText: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
    }
});
