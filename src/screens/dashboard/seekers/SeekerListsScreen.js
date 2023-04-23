import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {seekerData} from '../../../json/seekerData';
import HeaderComponent from '../../../components/general/HeaderComponent';
import SeekerItemComponent from '../../../components/seekers/SeekerItemComponent';
import {Icon} from 'react-native-elements';
import {TouchableFeedback} from '../../../utils/regex';

class SeekerListsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            seekerData
        }
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onSendSeeker = () => {
        const {navigation} = this.props;
        navigation.navigate('SendMySeekerRequest');
    };

    render() {
        const {seekerData} = this.state;
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Seekers'}
                                 theme={theme}
                                 rightView={<TouchableFeedback onPress={this.onSendSeeker}>
                                     <View style={styles.buttonView}>
                                         <Icon type={'feather'} name={'send'} size={28} color={theme.primaryColor} style={{fontSize: 28, color: theme.primaryColor}} />
                                     </View>
                                 </TouchableFeedback>}
                                 onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor, paddingHorizontal: 10}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={seekerData}
                        extraData={seekerData}
                        renderItem={({item}) => <SeekerItemComponent theme={theme} navigation={navigation} item={item}/> }
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(SeekerListsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonView: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
