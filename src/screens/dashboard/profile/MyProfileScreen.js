import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {HEIGHT_RATIO, regex, TouchableFeedback, W_WIDTH} from '../../../utils/regex';
import FastImage from 'react-native-fast-image';
import {Icon} from 'react-native-elements';
import ReadMore from 'react-native-read-more-text';
import {updateUserAction} from '../../../actions/userAction';
import SquarePhotoComponent from '../../../components/general/SquarePhotoComponent';
import ImagePicker from 'react-native-image-crop-picker';
import {assetUploadInCloudinaryServer} from '../../../actions/cloudinaryStorageAction';
import {Transparent} from '../../../themes/constantColors';

class MyProfileScreen extends Component {

    constructor(props) {
        super(props);
        let user = props.user;
        this.state = {
            name: user.name,
            DoB: user.DoB,
            photos: user.photos,
            bio: Boolean(user.bio) ? user.bio : '',
            height: regex.isEmpty(user.height) ? `0' / 00'` : user.height,
            bodyType: regex.isEmpty(user.bodyType) ? '' : user.bodyType,
            gender: regex.isEmpty(user.gender) ? '' : user.gender,
            sexuality: regex.isEmpty(user.sexuality) ? '' : user.sexuality,
            personality: regex.isEmpty(user.personality) ? '' : user.personality,
            education: regex.isEmpty(user.education) ? '' : user.education,
            maritalStatus: regex.isEmpty(user.maritalStatus) ? '' : user.maritalStatus,
            lookingFor: regex.isEmpty(user.lookingFor) ? '' : user.lookingFor,
            religion: regex.isEmpty(user.religion) ? '' : user.religion,
            drinkingStatus: regex.isEmpty(user.drinkingStatus) ? '' : user.drinkingStatus,
            smokingStatus: regex.isEmpty(user.smokingStatus) ? '' : user.smokingStatus,
            eatingStatus: regex.isEmpty(user.eatingStatus) ? '' : user.eatingStatus,
            isEdit: false,
        };

        this.lastIndex = regex.isEmpty(user.photos) ? 0 : user.photos.length;
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onEditPress = () => {
        let save  = !this.state.isEdit;
        this.setState({isEdit: save});
        if (!save) {
          let getUpdateData = JSON.parse(JSON.stringify(this.state));
          delete getUpdateData['name'];
          delete getUpdateData['DoB'];
          delete getUpdateData['photos'];
          delete getUpdateData['isEdit'];
          updateUserAction(this.props.user.uid, getUpdateData, 'profile');
        }
    };

    _handleTextReady = () => {

    };

    onItemInformationPress = ({title, value, index}) => {
        const {navigation} = this.props;
        const {isEdit} = this.state;

        if (!isEdit)
            return;

        navigation.navigate('SelectionInformation', {title, value, index, callback: (params) => {
                let parameter = {};
                if (params.index === 1) {
                    parameter.height = params.value;
                } else if (params.index === 2) {
                    parameter.bodyType = params.value;
                } else if (params.index === 3) {
                    parameter.gender = params.value;
                } else if (params.index === 4) {
                    parameter.sexuality = params.value;
                } else if (params.index === 5) {
                    parameter.personality = params.value;
                } else if (params.index === 6) {
                    parameter.education = params.value;
                } else if (params.index === 7) {
                    parameter.maritalStatus = params.value;
                } else if (params.index === 8) {
                    parameter.lookingFor = params.value;
                } else if (params.index === 9) {
                    parameter.religion = params.value;
                } else if (params.index === 10) {
                    parameter.drinkingStatus = params.value;
                } else if (params.index === 11) {
                    parameter.smokingStatus = params.value;
                } else if (params.index === 12) {
                    parameter.eatingStatus = params.value;
                }
                this.setState({...this.state, ...parameter});
        }});
    };

    uploadPhotos = (images) => {
        regex.showLoader();
        let uploadPhotos = [];
        for (let i = 0; i < images.length; i++) {
            uploadPhotos.push(assetUploadInCloudinaryServer(images[i]), false);
        }

        Promise.all(uploadPhotos).then(response => {
            regex.hideLoader();
            let photos = [...this.state.photos];
            response.forEach((asset) => {
                photos.push({
                    photoUrl: asset.secure_url,
                    public_id: asset.public_id
                });
            });
            this.lastIndex = photos.length;
            this.setState({photos});
            updateUserAction(this.props.user.uid, {photos: photos}, 'profile');
        }).catch(error => {
            regex.hideLoader();
        });
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
            if (images.length > 0)
                this.uploadPhotos(images);
        });
    };

    renderItemView = (title, value, index) => {
       const {theme} = this.props;
       const {isEdit} = this.state;
       return (
           <TouchableFeedback onPress={() => this.onItemInformationPress({title, value, index})}>
               <View style={[styles.commonView, {backgroundColor: theme.backgroundColor, borderColor: theme.borderColor}]}>
                   <Text style={[styles.commonText, {color: theme.primaryColor}]}>{title}</Text>
                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <Text style={[styles.commonText, {color: theme.subPrimaryColor}]}>{value}</Text>
                       {
                           isEdit && <Icon type={'feather'} name={'chevron-right'} size={25} color={theme.subPrimaryColor} style={{marginLeft: 10, fontSize: 25, color: theme.subPrimaryColor}} />
                       }
                   </View>
               </View>
           </TouchableFeedback>
       )
    };

    render() {
        const {theme, navigation} = this.props;
        const {isEdit, name, DoB, bio, photos, height, bodyType, gender, sexuality, personality, education, maritalStatus, lookingFor, religion, drinkingStatus, smokingStatus, eatingStatus} = this.state;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <StatusBar backgroundColor={Transparent} />
                <ParallaxScrollView
                    backgroundColor={theme.container.backgroundColor}
                    headerBackgroundColor={'transparent'}
                    contentContainerStyle={{borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -25}}
                    stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                    parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                    backgroundSpeed={10}
                    renderBackground={() => (
                        <View style={{height: PARALLAX_HEADER_HEIGHT, flex: 1}}>
                            <FastImage source={{uri: regex.getProfilePic(photos)}} style={[styles.imageView]}/>
                        </View>
                    )}
                    renderFixedHeader={() => (
                        <View key="fixed-header" style={styles.fixedSection}>
                            <TouchableFeedback onPress={this.onBackPress}>
                                <View style={styles.buttonView}>
                                    <Icon type={'feather'} name={'chevron-left'} size={35} color={theme.backgroundColor} style={{fontSize: 35, color: theme.backgroundColor}} />
                                </View>
                            </TouchableFeedback>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableFeedback onPress={this.onEditPress}>
                                    <View style={styles.buttonView}>
                                        <Icon type={'feather'} name={isEdit ? 'send' : 'edit'} color={theme.backgroundColor} style={{color: theme.backgroundColor}} />
                                    </View>
                                </TouchableFeedback>
                            </View>
                        </View>
                    )}>
                        <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                            <View style={{alignItems: 'center', justifyContent: 'center', marginVertical: 10}}>
                                <View style={{width: 50, height: 6, borderRadius: 3, backgroundColor: theme.subSecondaryColor}}/>
                            </View>
                            <Text style={[styles.nameText, {color: theme.primaryColor}]}>{`${name}${regex.getAge(DoB)}`}</Text>
                            <TouchableFeedback onPress={() => navigation.navigate('Payments')}>
                                <View style={[styles.premiumView]}>
                                    <View style={[styles.premiumInnerView, {backgroundColor: theme.pinkColor}]}>
                                        <Icon type={'MaterialCommunityIcons'} name={'crown'} style={{color: theme.backgroundColor}} />
                                        <Text style={[styles.premiumText, {color: theme.backgroundColor}]}>Upgrade to Premium</Text>
                                    </View>
                                </View>
                            </TouchableFeedback>
                            {
                                isEdit ? <TextInput style={[styles.bioText, {color: theme.subPrimaryColor, backgroundColor: theme.textInputBackgroundColor,}]}
                                                    value={bio}
                                                    placeholder="Write something about yourself..."
                                                    placeholderTextColor={theme.subPrimaryColor}
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    onChangeText={(bio) => this.setState({bio})}
                                /> : <View style={{marginHorizontal: 20}}>
                                    <ReadMore numberOfLines={3}
                                              renderTruncatedFooter={(handlePress) => {return <Text style={[styles.readMore, {color: theme.subPrimaryColor}]} onPress={handlePress}>Read more</Text>}}
                                              renderRevealedFooter={(handlePress) => {return <Text style={[styles.readMore, {color: theme.subPrimaryColor}]} onPress={handlePress}>Show less</Text>}}
                                              onReady={this._handleTextReady}
                                    >
                                        <Text style={[styles.bioDText, {color: theme.subPrimaryColor}]}>{bio}</Text>
                                    </ReadMore>
                                </View>
                            }
                            <View style={{height: 1, backgroundColor: theme.borderColor, marginVertical: 20}}/>

                            <Text style={[styles.photoText, {color: theme.primaryColor}]}>All Photos (0)</Text>
                            <View style={{marginHorizontal: 20, marginTop: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {
                                    photos.map((item) => {
                                        return <SquarePhotoComponent theme={theme} item={item}/>
                                    })
                                }
                            </View>
                            <TouchableFeedback onPress={() => this.openLibrary()}>
                                <View style={[styles.addPhotoView, {backgroundColor: theme.primaryBackgroundColor, borderColor: theme.borderColor}]}>
                                    <Icon type={'feather'} name={'plus'} color={theme.subSecondaryColor} style={{color: theme.subSecondaryColor}} />
                                    <Text style={[styles.buttonAddPhotoText, {color: theme.subSecondaryColor}]}> Add Photos</Text>
                                </View>
                            </TouchableFeedback>

                            <View style={[styles.commonView, {backgroundColor: theme.backgroundColor, borderColor: theme.borderColor}]}>
                                <Text style={[styles.commonText, {fontWeight: '600', color: theme.primaryColor}]}>Your Information</Text>
                            </View>
                            {this.renderItemView('Height', height, 1)}
                            {this.renderItemView('Body Type', bodyType, 2)}
                            {this.renderItemView('Gender', gender, 3)}
                            {this.renderItemView('Sexuality', sexuality, 4)}
                            {this.renderItemView('Personality', personality, 5)}
                            {this.renderItemView('Education', education, 6)}
                            {this.renderItemView('Marital Status', maritalStatus, 7)}
                            {this.renderItemView('Looking for', lookingFor, 8)}
                            {this.renderItemView('Religion', religion, 9)}
                            {this.renderItemView('Drinking', drinkingStatus, 10)}
                            {this.renderItemView('Smoking', smokingStatus, 11)}
                            {this.renderItemView('Eating', eatingStatus, 12)}
                            <View style={{marginVertical: 15}}/>
                        </View>
                </ParallaxScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
});

export default connect(mapStateToProps)(MyProfileScreen);

const PARALLAX_HEADER_HEIGHT = HEIGHT_RATIO(.468);
const STICKY_HEADER_HEIGHT = HEIGHT_RATIO(.103);

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
    imageView: {
        width: W_WIDTH,
        height: PARALLAX_HEADER_HEIGHT,
    },
    premiumView: {
        marginHorizontal: 20,
        marginVertical: 15,
    },
    premiumInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        borderRadius: 15
    },
    premiumText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    fixedSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 25,
        bottom: 0,
        right: 0,
        left: 0,
    },
    nameText: {
        paddingHorizontal: 20,
        marginTop: 10,
        fontSize: 24,
        fontWeight: '800',
    },
    readMore: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '600',
    },
    bioDText: {
        fontSize: 14,
        fontWeight: '400',
    },
    bioText: {
        marginHorizontal: 20,
        height: 100,
        padding: 15,
        paddingTop: 15,
        borderRadius: 15,
        marginTop: 5
    },
    photoText: {
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '600',
    },
    addPhotoView: {
        marginHorizontal: 20,
        marginVertical: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1
    },
    buttonAddPhotoText: {
        fontSize: 18,
        fontWeight: '600',
    },
    commonView: {
        marginHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1
    },
    commonText: {
        fontSize: 16,
        fontWeight: '400'
    }
});
