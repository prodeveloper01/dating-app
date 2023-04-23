import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import AllPhotoComponent from '../../../components/general/AllPhotoComponent';

class AllPhotoScreen extends Component {

    constructor(props) {
        super(props);
        let params = props.route.params;
        this.state = {
            photoData: params.photos
        }
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    render() {
        const {photoData} = this.state;
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'All Photos'} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor, paddingHorizontal: 10}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={photoData}
                        extraData={photoData}
                        renderItem={({item}) => <AllPhotoComponent theme={theme} item={item}/> }
                        numColumns={2}
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

export default connect(mapStateToProps)(AllPhotoScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
