import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {ASPECT_RATIO, regex} from '../../utils/regex';
import CommonButton from '../../components/general/CommonButton';

class CongratulationsScreen extends Component {

    constructor(props) {
        super(props);
    }

    discoverNowPress = () => {
        const {route} = this.props;
        let params = route.params;
        let data = params.data;

        regex.setDashboard({token: data.uid, ...data})
    };

    render() {
        const {theme, route} = this.props;
        let params = route.params;
        let photoData = params.photoData;
        let data = params.data;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <View style={styles.iconView}>
                    <FastImage source={{uri: photoData[0].path}} style={{width: 150, height: 150, borderRadius: 75}}/>
                    <Text style={[styles.logoText, {color: theme.secondaryColor}]}>{data.name}</Text>
                </View>
                <View style={[styles.bottomView]}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <FastImage source={require('./../../assets/congo.png')} style={{width: 60, height: 62}}/>
                        <Text style={[styles.congoText, {color: theme.secondaryColor}]}>Congratulations!</Text>
                        <Text style={[styles.messageText, {color: theme.subPrimaryColor}]}>You have successfully completed your profile</Text>
                    </View>
                    <CommonButton
                        theme={theme}
                        container={{marginBottom: ASPECT_RATIO(60)}}
                        backgroundColor={theme.pinkColor}
                        borderColor={theme.pinkColor}
                        textColor={theme.backgroundColor}
                        title={'Discover Now'}
                        onPress={this.discoverNowPress}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(CongratulationsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        marginTop: 10,
        fontSize: 26,
        fontWeight: '500',
    },
    bottomView: {
        flex: 1,
    },
    congoText: {
        marginTop: 5,
        fontSize: 26,
        fontWeight: '800',
    },
    messageText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '400',
    },
});
