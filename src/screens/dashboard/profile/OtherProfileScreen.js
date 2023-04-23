import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {HEIGHT_RATIO, regex, TouchableFeedback, W_WIDTH} from '../../../utils/regex';
import FastImage from 'react-native-fast-image';
import {Icon} from 'react-native-elements';
import {ONLINE, Transparent} from '../../../themes/constantColors';
import ReadMore from 'react-native-read-more-text';
import SquarePhotoComponent from '../../../components/general/SquarePhotoComponent';
import {distance} from '../../../utils/location';

class OtherProfileScreen extends Component {

    constructor(props) {
        super(props);
        let params = props.route.params;
        this.state = {
            instagramPhotos: [],
            ...params.profileData
        };
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    _handleTextReady = () => {

    };

    renderItemView = (title, value, index) => {
        const {theme} = this.props;
        return (
            <View style={[styles.commonView, {backgroundColor: theme.backgroundColor, borderColor: theme.borderColor}]}>
                <Text style={[styles.commonText, {color: theme.primaryColor}]}>{title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.commonText, {color: theme.subPrimaryColor}]}>{value}</Text>
                </View>
            </View>
        )
    };

    render() {
        const {theme, navigation} = this.props;
        const {instagramPhotos, online, name, DoB, bio, photos, height, bodyType, gender, sexuality, personality, education, maritalStatus, lookingFor, religion, drinkingStatus, smokingStatus, eatingStatus, location} = this.state;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <StatusBar backgroundColor={Transparent} />
                <ParallaxScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
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
                                    <Icon type={'feather'} name={'x'} size={30} color={theme.backgroundColor} style={{fontSize: 30, color: theme.backgroundColor}}/>
                                </View>
                            </TouchableFeedback>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableFeedback>
                                    <View style={styles.buttonView}>
                                        <Icon type={'feather'} name={'more-horizontal'} color={theme.backgroundColor} style={{color: theme.backgroundColor}} />
                                    </View>
                                </TouchableFeedback>
                            </View>
                        </View>
                    )}>
                    <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                        <View style={[styles.userView]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {online && <View style={styles.onlineView} />}
                                <Text style={[styles.nameText, {color: theme.primaryColor}]}>{name}{regex.getAge(DoB)}</Text>
                            </View>
                            <View style={[styles.locationView, {backgroundColor: theme.primaryBackgroundColor}]}>
                                <Icon type={'feather'} name={'map-pin'} size={14} color={theme.subPrimaryColor} style={{fontSize: 14, color: theme.subPrimaryColor}}/>
                                <Text style={[styles.timeText, {color: theme.subPrimaryColor, marginLeft: 5}]}>{`${distance(location, this.props.location, 'K')}`} km away</Text>
                            </View>
                            <ReadMore
                                numberOfLines={3}
                                renderTruncatedFooter={(handlePress) => {
                                    return <Text style={[styles.readMore, {color: theme.subPrimaryColor}]} onPress={handlePress}>Read more</Text>
                                }}
                                renderRevealedFooter={(handlePress) => {
                                    return <Text style={[styles.readMore, {color: theme.subPrimaryColor}]} onPress={handlePress}>Show less</Text>
                                }}
                                onReady={this._handleTextReady}>
                                <Text style={[styles.bioText, {color: theme.subPrimaryColor}]}>{bio}</Text>
                            </ReadMore>
                        </View>
                        <View style={{height: 1, backgroundColor: theme.borderColor, marginVertical: 20, marginBottom: 10}}/>

                        {
                            photos.length > 0 && <View style={[styles.commonView, {backgroundColor: theme.backgroundColor, borderBottomWidth: 0}]}>
                                <Text style={[styles.photoText, {color: theme.primaryColor}]}>All Photos (0)</Text>
                                <Text style={[styles.commonText, {color: theme.pinkColor}]} onPress={() => navigation.navigate('AllPhotos', {photos})}>See All</Text>
                            </View>
                        }
                        {
                            photos.length > 0 && <View style={{marginHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {
                                    photos.map((item) => {
                                        return <SquarePhotoComponent theme={theme} item={item}/>
                                    })
                                }
                            </View>
                        }
                        {
                            photos.length > 0 && <View style={{height: 1, backgroundColor: theme.borderColor, marginVertical: 20, marginHorizontal: 20, marginBottom: 10}}/>
                        }

                        {
                            instagramPhotos.length > 0 && <View style={[styles.commonView, {backgroundColor: theme.backgroundColor, borderBottomWidth: 0}]}>
                                <Text style={[styles.photoText, {color: theme.primaryColor}]}>Instagram Photos (0)</Text>
                                <Text style={[styles.commonText, {color: theme.pinkColor}]} onPress={() => navigation.navigate('AllPhotos')}>See All</Text>
                            </View>
                        }
                        {
                            instagramPhotos.length > 0 && <View style={{marginHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {
                                    instagramPhotos.map((item) => {
                                        return <SquarePhotoComponent theme={theme} item={item}/>
                                    })
                                }
                            </View>
                        }


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
    location: state.auth.location,
});

export default connect(mapStateToProps)(OtherProfileScreen);

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
    fixedSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 10,
        right: 0,
        left: 0,
    },
    userView: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    onlineView: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ONLINE,
        marginRight: 5,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '800',
    },
    locationView: {
        marginVertical: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
    },
    readMore: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '600',
    },
    bioText: {
        fontSize: 14,
        fontWeight: '400',
    },

    photoText: {
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
        fontSize: 18,
        fontWeight: '400'
    }
});
