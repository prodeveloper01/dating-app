import React, {Component} from 'react';
import {Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import CommonButton from '../general/CommonButton';
import {ASPECT_RATIO, regex, W_WIDTH} from '../../utils/regex';
import HeightModal from './HeightModal';
import {DatePickerDialog} from 'react-native-datepicker-dialog';
import moment from 'moment';
import {bodyTypeData, genderData} from '../../json/generalCatogeryData';
import * as messages from '../../utils/messages';

class Step2Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            DoB: props.data.DoB,
            dobDate: null,
            height: props.data.height,
            modalVisible: false,
            bodyType: props.data.bodyType,
            gender: props.data.gender,
            bodyTypeData: bodyTypeData,
            genderData: genderData
        }
    }

    nextPress = () => {
        const {DoB, height, bodyType, gender} = this.state;
        const {onPress} = this.props;

        if (DoB === 'MM / DD / YYYY')
            alert(messages.enterDOB);
        else if (height === `0' / 00'`)
            alert(messages.enterHeight);
        else if (regex.isEmpty(bodyType))
            alert(messages.enterBodyType);
        else if (regex.isEmpty(gender))
            alert(messages.enterGender);
        else {
            onPress(2, {DoB, height, bodyType, gender});
        }
    };

    openHeightPress = () => {
        this.setState({modalVisible: true});
    };

    /**
     * DOB textbox click listener
     */
    onDOBPress = () => {
        let dobDate = this.state.dobDate;

        if(!dobDate || dobDate === null){
            dobDate = new Date();
            this.setState({dobDate: dobDate});
        }

        //To open the dialog
        this.dobDialogRef.open({
            date: dobDate,
            maxDate: new Date()
        });
    };

    /**
     * Call back for dob date picked event
     *
     */
    onDOBDatePicked = (date) => {
        this.setState({
            dobDate: date,
            DoB: moment(date).format('MM / DD / YYYY')
        });
    };

    onBodyTypePress = (item) => {
        this.setState({bodyType: item.title});
    };

    renderBodyTypeItem = ({ item }) => {
        const {bodyType} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (bodyType === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderColor={selected ? theme.pinkColor : theme.borderColor}
                textColor={selected ? theme.pinkColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onBodyTypePress(item)}
            />
        )
    };

    onGenderPress = (item) => {
        this.setState({gender: item.title});
    };

    renderGenderItem = ({ item }) => {
        const {gender} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (gender === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderColor={selected ? theme.pinkColor : theme.borderColor}
                textColor={selected ? theme.pinkColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onGenderPress(item)}
            />
        )
    };

    onPress = (item, section) => {
        if (section === '0') {
           this.onBodyTypePress(item)
        } else if (section === '1') {
           this.onGenderPress(item) 
        } 
    };

    renderItem = (item, section) => {
        const {bodyType, gender} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (bodyType === item.title || gender === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderColor={selected ? theme.pinkColor : theme.borderColor}
                textColor={selected ? theme.pinkColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onPress(item, section)}
            />
        )
    };

    render() {
        const {DoB, height, bodyTypeData, genderData, modalVisible} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <ScrollView showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
                    <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'My Birthday is'}</Text>
                    <View>
                        <Text style={[styles.titleTextInput, {color: theme.subPrimaryColor}]}>Date of Birth*</Text>
                        <CommonButton
                            theme={theme}
                            container={{marginTop: 5}}
                            backgroundColor={theme.textInputBackgroundColor}
                            borderColor={theme.textInputBackgroundColor}
                            textColor={theme.subPrimaryColor}
                            title={DoB}
                            onPress={this.onDOBPress}
                        />
                        <Text style={[styles.titleTextInput, {marginVertical: 10, color: theme.subSecondaryColor}]}>Your age will be public</Text>
                        <Text style={[styles.titleTextInput, {color: theme.subPrimaryColor}]}>Height</Text>
                        <CommonButton
                            theme={theme}
                            container={{marginTop: 5}}
                            backgroundColor={theme.textInputBackgroundColor}
                            borderColor={theme.textInputBackgroundColor}
                            textColor={theme.subPrimaryColor}
                            title={height}
                            onPress={this.openHeightPress}
                            dropDownArrow={true}
                            arrowColor={theme.subPrimaryColor}
                        />
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Body Type'}</Text>
                        {
                            bodyTypeData.map((item) => {
                                return this.renderItem(item, '0')
                            })
                        }
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Gender'}</Text>
                        {
                            genderData.map((item) => {
                                return this.renderItem(item, '1')
                            })
                        }
                        <CommonButton
                            theme={theme}
                            container={{marginVertical: ASPECT_RATIO(30)}}
                            backgroundColor={theme.pinkColor}
                            borderColor={theme.pinkColor}
                            textColor={theme.backgroundColor}
                            title={'Continue'}
                            onPress={this.nextPress}
                        />
                    </View>
                </ScrollView>
                <Modal animationType={'fade'} transparent={true} visible={modalVisible} onRequestClose={() => {}}>
                    <HeightModal theme={theme} selectedHeightStatus={height}
                                 onClose={(height) => {
                                     let setStateData = {modalVisible: false};
                                     if (height)
                                         setStateData.height = height;

                                     this.setState(setStateData);
                                 }}/>
                </Modal>
                <DatePickerDialog ref={ref => this.dobDialogRef = ref} onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View>
        );
    }
}

export default Step2Component;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: W_WIDTH
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center'
    },
    titleTextInput: {
        marginHorizontal: 20,
        marginVertical: 5,
        fontSize: 14,
        fontWeight: '500'
    }
});
