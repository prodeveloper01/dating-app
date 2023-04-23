import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableFeedback} from '../../utils/regex';
import {Icon} from 'react-native-elements';

class CommonButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {theme, backgroundColor, borderColor, title, textColor, container, innerContainer, onPress, dropDownArrow, arrowColor} = this.props;

        return (
            <View style={[styles.viewContainer, container]}>
                <TouchableFeedback onPress={()=>onPress()}>
                    <View style={[styles.buttonInnerContainer, {backgroundColor, borderColor}, innerContainer]}>
                        <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
                        {
                            dropDownArrow
                            && <Icon type={'feather'}
                                     name={'chevron-down'}
                                     size={20}
                                     color={arrowColor}
                                     style={{fontSize: 20, color: arrowColor, position: 'absolute', right: 20}}
                            />
                        }
                    </View>
                </TouchableFeedback>
            </View>
        );
    }
}

export default CommonButton;

const styles = StyleSheet.create({
    viewContainer: {
        marginHorizontal: 20,
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderWidth: 1,
        borderRadius: 28,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
    }
});
