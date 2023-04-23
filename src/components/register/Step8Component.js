import React, {Component} from 'react';
import {StyleSheet, Text, View, SectionList} from 'react-native';
import CommonButton from '../general/CommonButton';
import {W_WIDTH} from '../../utils/regex';
import {drinkingData, eatingData, smokingData} from '../../json/generalCatogeryData';

class Step8Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            drinkingStatus: props.data.drinkingStatus,
            smokingStatus: props.data.smokingStatus,
            eatingStatus: props.data.eatingStatus,
            sections: [
                {
                    id: '0',
                    title: 'Drinking',
                    data: drinkingData,
                },
                {
                    id: '1',
                    title: 'Smoking',
                    data: smokingData,
                },
                {
                    id: '2',
                    title: 'Eating',
                    data: eatingData,
                },
            ]
        }
    }

    onDrinkingPress = (item) => {
        if (item.title === this.state.drinkingStatus)
            this.setState({drinkingStatus: ''});
        else
            this.setState({drinkingStatus: item.title});
    };

    onSmokingPress = (item) => {
        if (item.title === this.state.smokingStatus)
            this.setState({smokingStatus: ''});
        else
            this.setState({smokingStatus: item.title});
    };

    onEatingPress = (item) => {
        const {eatingStatus} = this.state;
        const {onPress} = this.props;
        if (item.title === eatingStatus)
            this.setState({eatingStatus: ''});
        else
            this.setState({eatingStatus: item.title}, () => {
                const {drinkingStatus, smokingStatus, eatingStatus} = this.state;
                if (drinkingStatus !== '' && smokingStatus !== '' && eatingStatus !== '')
                    onPress(8, {drinkingStatus, smokingStatus, eatingStatus});
            });
    };

    onPress = (item, section) => {
        if (section.id === '0') {
            this.onDrinkingPress(item)
        } else if (section.id === '1') {
            this.onSmokingPress(item)
        } else if (section.id === '2') {
            this.onEatingPress(item)
        }
    };

    renderItem = ({ item, section }) => {
        const {drinkingStatus, smokingStatus, eatingStatus} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (drinkingStatus === item.title || smokingStatus === item.title || eatingStatus === item.title)
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
        const {sections} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <SectionList
                    style={styles.container}
                    sections={sections}
                    renderItem={this.renderItem}
                    renderSectionHeader={({ section }) => (
                        <View style={{backgroundColor: theme.container.backgroundColor}}>
                            <Text style={[styles.titleText, {color: theme.primaryColor}]}>{section.title}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    extraData={this.state}
                />
            </View>
        );
    }
}

export default Step8Component;

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
});
