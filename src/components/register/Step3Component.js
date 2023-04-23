import React, {Component} from 'react';
import {StyleSheet, Text, View, SectionList} from 'react-native';
import CommonButton from '../general/CommonButton';
import {W_WIDTH} from '../../utils/regex';
import {personalityData, sexualityData} from '../../json/generalCatogeryData';

class Step3Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sexuality: props.data.sexuality,
            personality: props.data.personality,
            sections: [
                {
                    id: '0',
                    title: 'Sexuality',
                    data: sexualityData,
                },
                {
                    id: '1',
                    title: 'Personality',
                    data: personalityData,
                }
            ]
        }
    }

    onSexualityPress = (item) => {
        if (item.title === this.state.sexuality) {
            this.setState({sexuality: ''});
        } else
            this.setState({sexuality: item.title});
    };

    onPersonalityPress = (item) => {
        const {sexuality, personality} = this.state;
        const {onPress} = this.props;
        if (item.title === personality)
            this.setState({personality: ''});
        else
            this.setState({personality: item.title}, () => {
                const {sexuality, personality} = this.state;
                if (personality !== '' && sexuality !== '')
                    onPress(3, {sexuality, personality});
            });
    };

    onPress = (item, section) => {
        if (section.id === '0') {
            this.onSexualityPress(item)
        } else if (section.id === '1') {
            this.onPersonalityPress(item)
        }
    };

    renderItem = ({ item, section }) => {
        const {sexuality, personality} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (sexuality === item.title || personality === item.title)
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

export default Step3Component;

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
