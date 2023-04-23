import React, {Component} from 'react';
import {Animated, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../components/general/HeaderComponent';
import Step1Component from '../../components/register/Step1Component';
import Step2Component from '../../components/register/Step2Component';
import Step3Component from '../../components/register/Step3Component';
import Step4Component from '../../components/register/Step4Component';
import Step5Component from '../../components/register/Step5Component';
import Step6Component from '../../components/register/Step6Component';
import Step7Component from '../../components/register/Step7Component';
import Step8Component from '../../components/register/Step8Component';
import {regex, W_WIDTH} from '../../utils/regex';
import {updateUserAction} from '../../actions/userAction';

class RegistrationStepScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
            progressStatus: 100/8,
        };

        let params = props.route.params;
        this.lastStepCompleted = params.stepCompleted;
        this.getData = {
            name: regex.isEmpty(params.name) ? '' : params.name,
            username: regex.isEmpty(params.username) ? '' : params.username,
            email: regex.isEmpty(params.email) ? '' : params.email,
            DoB: regex.isEmpty(params.DoB) ? 'MM / DD / YYYY' : params.DoB,
            height: regex.isEmpty(params.height) ? `0' / 00'` : params.height,
            bodyType: regex.isEmpty(params.bodyType) ? '' : params.bodyType,
            gender: regex.isEmpty(params.gender) ? '' : params.gender,
            sexuality: regex.isEmpty(params.sexuality) ? '' : params.sexuality,
            personality: regex.isEmpty(params.personality) ? '' : params.personality,
            education: regex.isEmpty(params.education) ? '' : params.education,
            maritalStatus: regex.isEmpty(params.maritalStatus) ? '' : params.maritalStatus,
            lookingFor: regex.isEmpty(params.lookingFor) ? '' : params.lookingFor,
            religion: regex.isEmpty(params.religion) ? '' : params.religion,
            drinkingStatus: regex.isEmpty(params.drinkingStatus) ? '' : params.drinkingStatus,
            smokingStatus: regex.isEmpty(params.smokingStatus) ? '' : params.smokingStatus,
            eatingStatus: regex.isEmpty(params.eatingStatus) ? '' : params.eatingStatus,
            socialType: regex.isEmpty(params.socialType) ? 'phone' : params.socialType,
        };
    }
    anim = new Animated.Value(0);

    onBackPress = (type) => {
        const {currentIndex} = this.state;
        const {navigation} = this.props;
        if (type === 1) {
           navigation.goBack();
        } else if (type === 2) {
            let index = currentIndex - 1;
            this.scrollRef.scrollTo({x: ((index - 1) * W_WIDTH), y: 0, animated: true});
            this.setPage(index);
        } else if (type === 3) {
           this.onContinuesPress(currentIndex)
        }
    };

    onContinuesPress = (index, data) => {
        let page = index + 1;
        if (page > 8) {
            const {navigation, route} = this.props;
            let params = route.params;

            this.getData = {...params, ...this.getData, ...data};
            this.storeDataInFirestore(8, data);
            navigation.navigate('AddPhoto', {data: this.getData});
            return;
        }
        this.scrollRef.scrollTo({x: (index * W_WIDTH), y: 0, animated: true});
        this.setPage(page);
        this.getData = {...this.getData, ...data};
        this.storeDataInFirestore(index, data);
    };

    storeDataInFirestore = (index, data) => {
        let params = this.props.route.params;
        let uid = params.uid;

        if (this.lastStepCompleted < index)
            this.lastStepCompleted = index;
        else
            return;

        let parameter = {};
        if (index === 1)
           parameter = data;
        else if (index === 2) {
           parameter = data;
           if (Boolean(data.DoB))
              parameter.age = regex.getAge(data.DoB).replace(', ', '');
        } else if (index === 3) {
            parameter = (regex.isEmpty(data)) ? {sexuality: '', personality: ''} : data;
        } else if (index === 4) {
            parameter = (regex.isEmpty(data)) ? {education: ''} : data;
        } else if (index === 5) {
            parameter = (regex.isEmpty(data)) ? {maritalStatus: ''} : data;
        } else if (index === 6) {
            parameter = (regex.isEmpty(data)) ? {lookingFor: ''} : data;
        } else if (index === 7) {
            parameter = (regex.isEmpty(data)) ? {religion: ''} : data;
        } else if (index === 8) {
            parameter = (regex.isEmpty(data)) ? {drinkingStatus: '', smokingStatus: '', eatingStatus: ''} : data;
        }

        updateUserAction(uid, {...parameter, stepCompleted: this.lastStepCompleted}, 'register');
    };

    setPage = (page) => {
        this.setState({currentIndex: page, progressStatus: (page * 100)/8});
    };

    onScrollMoment = (e) => {
        let offset = e.nativeEvent.contentOffset;
        let page = Math.round(offset.x / W_WIDTH) + 1;
        if (page > 8)
            return;

        this.setPage(page);
    };

    render() {
        const {currentIndex, progressStatus} = this.state;
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent type={1} currentIndex={currentIndex} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.inner ,{backgroundColor: theme.subSecondaryColor}]}>
                    <Animated.View style={[styles.outer,{width: `${progressStatus}%`, backgroundColor: theme.pinkColor}]}/>
                </View>
                <ScrollView ref={ref => this.scrollRef = ref}
                            horizontal={true}
                            pagingEnabled={true}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={this.onScrollMoment}>
                    <Step1Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step2Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step3Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step4Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step5Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step6Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step7Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                    <Step8Component theme={theme} onPress={this.onContinuesPress} data={this.getData}/>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(RegistrationStepScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        marginVertical: 10,
        marginHorizontal: 20,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden'
    },
    outer: {
        height: 4,
        borderRadius: 2,
    }
});
