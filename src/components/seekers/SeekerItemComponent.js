import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableFeedback, W_WIDTH} from '../../utils/regex';
import FastImage from 'react-native-fast-image';

class SeekerItemComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {theme, item, navigation} = this.props;

        return (
            <TouchableFeedback onPress={() => navigation.navigate('SeekerUser', {seeker: item})}>
                <View style={[styles.container, {borderColor: theme.borderColor}]}>
                    <FastImage source={item.source} style={[styles.imageView]}/>
                    <Text style={[styles.titleText, {color: theme.primaryColor}]}>{item.title}</Text>
                </View>
            </TouchableFeedback>
        );
    }
}

export default SeekerItemComponent;

const totalWidth = W_WIDTH / 3;
const imageWidth = totalWidth - 40;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: totalWidth,
        paddingHorizontal: 10,
        paddingVertical: 10,
        overflow: 'hidden',
        alignItems: 'center'
    },
    imageView: {
        width: imageWidth,
        height: imageWidth,
        borderRadius: imageWidth / 2,
    },
    titleText: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center'
    }
});
