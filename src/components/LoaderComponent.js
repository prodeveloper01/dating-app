import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {PINK, White} from '../themes/constantColors';
import {shadow} from '../utils/regex';

const LoaderComponent = props => {
  const {
    loading
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator color={White} size={'large'} animating={loading}/>
        </View>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: PINK,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    ...shadow(4)
  }
});

export default LoaderComponent;
