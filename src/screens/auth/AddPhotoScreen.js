import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../components/general/HeaderComponent';
import {Icon} from 'react-native-elements';
import AddPhotoComponent from '../../components/register/AddPhotoComponent';
import ImagePicker from 'react-native-image-crop-picker';
import {updateUserAction} from '../../actions/userAction';
import {regex, TouchableFeedback} from '../../utils/regex';
import {assetUploadInCloudinaryServer} from '../../actions/cloudinaryStorageAction';

class AddPhotoScreen extends Component {

    lastIndex = 0;
    constructor(props) {
        super(props);
        this.state = {
            profilePicUrl: '',
            photoData: [
                {
                    id: 1,
                    photoUrl: '',
                },
                {
                    id: 2,
                    photoUrl: '',
                },
                {
                    id: 3,
                    photoUrl: '',
                },
                {
                    id: 4,
                    photoUrl: '',
                },
                {
                    id: 5,
                    photoUrl: '',
                },
                {
                    id: 6,
                    photoUrl: '',
                },
                {
                    id: 7,
                    photoUrl: '',
                },
                {
                    id: 8,
                    photoUrl: '',
                },
                {
                    id: 9,
                    photoUrl: '',
                },
                {
                    id: 10,
                    photoUrl: '',
                },
            ]
        };
        regex.hideLoader();
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onRightPress = () => {
        const {photoData} = this.state;
        const {navigation, route} = this.props;
        let getResults = [];
        photoData.forEach(a => {
            if (a.photoUrl !== '') {
                let data = {...a.data};
                getResults.push(data);
            }
        });

        let data = route.params.data;
        let uid = data.uid;
        if (getResults.length > 0) {
            regex.showLoader();
            let uploadPhotos = [];
            getResults.forEach((file) => {
                uploadPhotos.push(assetUploadInCloudinaryServer(file, false));
            });

            Promise.all(uploadPhotos).then(response => {
                regex.hideLoader();
                let photos = [];
                response.forEach((asset) => {
                    photos.push({
                        photoUrl: asset.secure_url,
                        public_id: asset.public_id
                    });
                });
                updateUserAction(uid, {stepCompleted: 9, photos: photos, status: 'Active'}, 'register');
                navigation.navigate('Congratulations', {data: {...data, photos: photos}, photoData: getResults});
            }).catch(error => {
                regex.hideLoader();
            });
        } else {
            updateUserAction(uid, {stepCompleted: 9, photos: [], status: 'Active'}, 'register');
            navigation.navigate('Congratulations', {data: {...data, photos: []}, photoData: [{path: 'https://i7.uihere.com/icons/263/936/60/user-avatar-dad7b8c4dcef5018355540aed51e83ea.png'}]});
        }
    };

    openLibrary = () => {
        let selectedLength = 12 - this.lastIndex;
        if (selectedLength < 0)
            return;

        ImagePicker.openPicker({
            multiple: true,
            maxSize: selectedLength,
            compressQuality: 20,
            mediaType: 'photo'
        }).then(images => {
            for (let i = 0; i < images.length; i++) {
               let getData = this.state.photoData[this.lastIndex + i];
               getData.photoUrl = images[i].path;
               getData.data = images[i];
            }
            this.setState({photoData: this.state.photoData});
            this.lastIndex = this.lastIndex + images.length;
        });
    };

    removePhoto = (index) => {
        let getData = this.state.photoData[index];
        getData.photoUrl = '';
        getData.data = '';
        this.setState({photoData: this.state.photoData}, () => {
            let getResults = [];
            this.state.photoData.forEach(a => {
                if (a.photoUrl !== '')
                    getResults.push(a.data);
            });
            for (let i = 0; i < this.state.photoData.length; i++) {
                let getData = this.state.photoData[i];
                if (i < getResults.length) {
                    getData.photoUrl = getResults[i].path;
                    getData.data = getResults[i];
                } else {
                    getData.photoUrl = '';
                    getData.data = '';
                }
            }
            this.lastIndex = getResults.length;
            this.setState({photoData: this.state.photoData});
        });
    };

    render() {
        const {photoData} = this.state;
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Add Photos'}
                                 theme={theme}
                                 rightView={<TouchableFeedback onPress={this.onRightPress}>
                                     <View style={styles.buttonView}>
                                         <Icon type={'feather'} name={'check'} color={theme.pinkColor} style={{color: theme.pinkColor}} />
                                     </View>
                                 </TouchableFeedback>}
                                 onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={photoData}
                        extraData={photoData}
                        renderItem={({item, index}) => <AddPhotoComponent theme={theme} item={item} index={index} openLibrary={this.openLibrary} removePhoto={this.removePhoto}/> }
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

export default connect(mapStateToProps)(AddPhotoScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonView: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
