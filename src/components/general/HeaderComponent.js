import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {White} from '../../themes/constantColors';
import {Header_Height, regex, TouchableFeedback, W_WIDTH} from '../../utils/regex';

class HeaderComponent extends React.PureComponent {
    render() {
        const {theme, title, titleStyle, leftView, rightView, onLeftPress, type, currentIndex} = this.props;

        if (type === 1) { // Register Step Header
            let getIndex = currentIndex;
            return (
                <Header containerStyle={styles.header} backgroundColor={'transparent'} barStyle={'dark-content'}>
                    <View style={styles.container}>
                        {
                            currentIndex === 1
                                ? <TouchableFeedback onPress={()=>onLeftPress(1)}>
                                    <View style={styles.buttonView}>
                                        <Icon type={'feather'} name={'chevron-left'} size={35} color={theme.primaryColor} />
                                    </View>
                                </TouchableFeedback>
                                : <TouchableFeedback onPress={()=>onLeftPress(2)}>
                                    <View style={[styles.buttonView, {width: null, paddingHorizontal: 10}]}>
                                        <Text style={{fontSize: 14, fontWeight: '600', color: theme.pinkColor}}>Previous</Text>
                                    </View>
                                </TouchableFeedback>
                        }
                        <View style={styles.bodyView}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 16, fontWeight: '600', color: theme.primaryColor}}>{getIndex}</Text>
                                <Text style={{fontSize: 16, fontWeight: '600', color: theme.subSecondaryColor}}>/8</Text>
                            </View>
                        </View>
                        {
                            getIndex > 2
                                ? <TouchableFeedback onPress={()=>onLeftPress(3)}>
                                    <View style={[styles.buttonView, {width: null, paddingHorizontal: 10}]}>
                                        <Text style={{fontSize: 14, fontWeight: '600', color: theme.pinkColor}}>Skip</Text>
                                    </View>
                                </TouchableFeedback>
                                : <View style={[styles.buttonView]} />
                        }
                    </View>
                </Header>
            );
        }

        return (
            <Header containerStyle={styles.header} backgroundColor={'transparent'} barStyle={'dark-content'}>
                <View style={styles.container}>
                    {
                        leftView
                            ? leftView
                            : <TouchableFeedback onPress={()=>onLeftPress()}>
                                <View style={styles.buttonView}>
                                    <Icon type={'feather'} name={'chevron-left'} size={35} color={theme.primaryColor} />
                                </View>
                            </TouchableFeedback>
                    }
                    <View style={styles.bodyView}>
                        {title && <Text style={{fontSize: 20, fontWeight: '600', color: theme.primaryColor, ...titleStyle}}>{title}</Text>}
                    </View>
                    {
                        rightView
                            ? rightView
                            : <View style={styles.buttonView} />
                    }
                </View>
            </Header>
        );
    }
}

export default HeaderComponent;

const styles = StyleSheet.create({
    container: {
      width: W_WIDTH,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    header: {
        paddingLeft: 0,
        paddingRight: 0,
        height: Header_Height,
        width: W_WIDTH,
    },
    bodyView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonView: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
