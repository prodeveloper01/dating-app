import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import {Icon} from 'react-native-elements';
import {TouchableFeedback} from '../../../utils/regex';
import {openCardModal, setUpStripe} from '../../../actions/paymentAction';
import moment from 'moment';

class PaymentMethodScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        setUpStripe();
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    openCardDetail = async () => {
        const { user, route, navigation } = this.props;
        let params = route.params;
        let type = params.isMonth ? 'M' : 'y';
        let packageEndDate = moment().add(1, type).unix();
        let amount = params.isMonth ? 25 : 250;

        openCardModal(user, amount, packageEndDate, navigation);
    };

    render() {
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Payment Method'} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.innerView, {backgroundColor: theme.primaryBackgroundColor}]}>
                    <Text style={[styles.titleText, {color: theme.subSecondaryColor}]}>Choose your preferred payment method</Text>
                    <TouchableFeedback onPress={this.openCardDetail}>
                        <View style={[styles.optionView, {backgroundColor: theme.backgroundColor}]}>
                            <View style={{flex: 1}}>
                                <Text style={{color: theme.secondaryColor}}>Credit or debit card</Text>
                            </View>
                            <Icon type={'feather'} name={'chevron-right'} size={30} color={theme.subPrimaryColor} style={{fontSize: 30, color: theme.subPrimaryColor}}/>
                        </View>
                    </TouchableFeedback>
                    {/*<View style={[styles.optionView, {backgroundColor: theme.backgroundColor}]}>*/}
                    {/*   <View style={{flex: 1}}>*/}
                    {/*       <FastImage source={require('./../../../assets/paypal.png')} style={{width: 81, height: 20}}/>*/}
                    {/*   </View>*/}
                    {/*   <Icon type={'feather'} name={'chevron-right'} style={{fontSize: 30, color: theme.subPrimaryColor}}/>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.optionView, {backgroundColor: theme.backgroundColor}]}>*/}
                    {/*    <View style={{flex: 1}}>*/}
                    {/*        <FastImage source={require('./../../../assets/gpay.png')} style={{width: 49, height: 20}}/>*/}
                    {/*    </View>*/}
                    {/*    <Icon type={'feather'} name={'chevron-right'} style={{fontSize: 30, color: theme.subPrimaryColor}}/>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.optionView, {backgroundColor: theme.backgroundColor}]}>*/}
                    {/*    <View style={{flex: 1}}>*/}
                    {/*        <FastImage source={require('./../../../assets/applepay.png')} style={{width: 43, height: 20}}/>*/}
                    {/*    </View>*/}
                    {/*    <Icon type={'feather'} name={'chevron-right'} style={{fontSize: 30, color: theme.subPrimaryColor}}/>*/}
                    {/*</View>*/}
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
});

export default connect(mapStateToProps)(PaymentMethodScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerView: {
        flex: 1,
    },
    titleText: {
        marginHorizontal: 20,
        marginVertical: 20,
        fontSize: 14,
        fontWeight: '600'
    },
    optionView: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 2,
    }
});
