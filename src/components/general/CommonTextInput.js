import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Input} from 'react-native-elements';

class CommonTextInput extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {placeholder} = this.props;

        return (
            <View style={[styles.viewContainer]}>
                <View>
                    <Text style={{marginLeft: 10}}>{placeholder}</Text>
                    <Input style={{paddingLeft: 0}}
                           autoCapitalize={'none'}
                           {...this.props}/>
                </View>
            </View>
        );
    }
}

export default CommonTextInput;

const styles = StyleSheet.create({
    viewContainer: {
      marginVertical: 10,
      marginHorizontal: 20,
    },
});
