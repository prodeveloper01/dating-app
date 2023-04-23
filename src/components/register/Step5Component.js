import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import CommonButton from '../general/CommonButton';
import {W_WIDTH} from '../../utils/regex';
import {maritalData} from '../../json/generalCatogeryData';

class Step5Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maritalStatus: props.data.maritalStatus,
            maritalData: maritalData
        }
    }

    onMaritalPress = (item) => {
        const {maritalStatus} = this.state;
        const {onPress} = this.props;
        if (item.title === maritalStatus)
            this.setState({maritalStatus: ''});
        else
            this.setState({maritalStatus: item.title}, () => {
                const {maritalStatus} = this.state;
                onPress(5, {maritalStatus});
            });
    };

    renderMaritalItem = ({ item }) => {
        const {maritalStatus} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (maritalStatus === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderColor={selected ? theme.pinkColor : theme.borderColor}
                textColor={selected ? theme.pinkColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onMaritalPress(item)}
            />
        )
    };

    render() {
        const {maritalData} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <View>
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{`Marital Status`}</Text>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={maritalData}
                            renderItem={this.renderMaritalItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
            </View>
        );
    }
}

export default Step5Component;

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
