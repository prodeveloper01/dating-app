import React, {Component} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {ASPECT_RATIO, TouchableFeedback, W_WIDTH} from '../../../utils/regex';
import {White} from '../../../themes/constantColors';
import CommonButton from '../../../components/general/CommonButton';
import {Icon} from 'react-native-elements';

class PaymentPackagesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMonth: true,
        }
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    subscribeNowPress = () => {
        const {isMonth} = this.state;
        const {navigation} = this.props;
        navigation.navigate('PaymentMethod', {isMonth: isMonth});
    };

    toggleSwitch = (isMonth) => {
        this.setState({isMonth});
    };

    renderFunctionalityItem = (title) => {
        const {theme} = this.props;
        return <View style={[styles.renderItemView]}>
            <Icon type={'feather'} name={'check'} size={20} color={theme.pinkColor} style={{fontSize: 20, color: theme.pinkColor}}/>
            <Text style={styles.renderItemText}>{title}</Text>
        </View>
    };

    render() {
        const {isMonth} = this.state;
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    <View style={styles.emptyView}>
                        <FastImage source={require('./../../../assets/payment_background.png')} style={{width: W_WIDTH, height: 238}}/>
                        <FastImage source={require('./../../../assets/payment_curve.png')} style={{position: 'absolute', top: 188, width: W_WIDTH, height: 238}}/>
                        <View style={{marginVertical: 15}}>
                            <Text style={[styles.titleText, {marginTop: 188 - 238, color: theme.primaryColor}]}>Pricing</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                                <Text style={[styles.monthlyText, {marginRight: 10, color: theme.primaryColor}]}>Bill yearly</Text>
                                <Switch
                                    trackColor={{ false: theme.pinkColor, true: theme.pinkColor }}
                                    thumbColor={White}
                                    ios_backgroundColor={'transparent'}
                                    onValueChange={this.toggleSwitch}
                                    value={isMonth}
                                />
                                <Text style={[styles.monthlyText, {marginLeft: 10, color: theme.primaryColor}]}>Bill monthly</Text>
                            </View>
                        </View>
                        <View style={[styles.emptyView, {paddingHorizontal: 20}]}>
                            <View style={[styles.packageInfoView, {backgroundColor: theme.backgroundColor}]}>
                                <View>
                                    <Text style={styles.packageTitleText}>{'Premium Plan'}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={styles.priceText}>{`$${isMonth ? '25' : '250'}`}</Text>
                                        <Text style={[styles.priceTitleText, {color: theme.subSecondaryColor}]}>{`/${isMonth ? 'month' : 'year'}`}</Text>
                                    </View>
                                </View>
                                {this.renderFunctionalityItem('Unlimited swipes')}
                                {this.renderFunctionalityItem('Message directly')}
                                {this.renderFunctionalityItem('Swipe around the world')}
                                {this.renderFunctionalityItem('See who like you')}
                                {this.renderFunctionalityItem('Access to all seekers options')}
                            </View>
                            <CommonButton
                                theme={theme}
                                container={{marginBottom: ASPECT_RATIO(10), marginTop: ASPECT_RATIO(10)}}
                                backgroundColor={theme.pinkColor}
                                borderColor={theme.pinkColor}
                                textColor={theme.backgroundColor}
                                title={'Subscribe Now'}
                                onPress={this.subscribeNowPress}
                            />
                        </View>
                    </View>
                    <View style={{position: 'absolute', top: 40}}>
                        <TouchableFeedback onPress={this.onBackPress}>
                            <View style={styles.buttonView}>
                                <Icon type={'feather'} name={'chevron-left'} size={35} color={theme.backgroundColor} style={{fontSize: 35, color: theme.backgroundColor}} />
                            </View>
                        </TouchableFeedback>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(PaymentPackagesScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonView: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyView: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    titleText: {
        marginTop: 10,
        fontSize: 34,
        fontWeight: '800',
        textAlign: 'center'
    },
    monthlyText: {
        fontSize: 16,
        fontWeight: '500',
    },
    packageInfoView: {
        flex: 1,
        borderRadius: 36,
        paddingHorizontal: 20,
        paddingVertical: 8
    },
    packageTitleText: {
        marginTop: 8,
        fontSize: 24,
        fontWeight: '800',
    },
    renderItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ASPECT_RATIO(2),
    },
    renderItemText: {
        marginLeft: 10,
        fontSize: 14,
    },
    priceText: {
        fontSize: 45,
        fontWeight: '800',
    },
    priceTitleText: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: '800',
    }
});
