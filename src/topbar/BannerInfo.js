import React, { Component } from 'react';
import { Text, StyleSheet, View, Alert, Platform } from 'react-native';
import i18n from '../common/services/i18n.service';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { CommonStyle as CS } from '../styles/Common';
import { observer, inject } from 'mobx-react';
import isIphoneX from '../common/helpers/isIphoneX';
import apiService from '../common/services/api.service';
import featuresService from '../common/services/features.service';

/**
 * Email Confirmation Message
 */
export default
@inject('user')
@observer
class BannerInfo extends Component {
  /**
   * Dismiss message
   */
  dismissForLogged = () => {
    this.props.user.setDissmisBanner(true);
  };

  /**
   * Render
   */
  render() {
    const show =
      !this.props.user.bannerInfoDismiss &&
      (!this.props.logged || featuresService.has('radiocity'));

    console.log("bannerinfo", show);
    if (!show) {
      return null;
    }

    return (
      <View style={styles.container}>


          <Text style={[CS.fontM, CS.colorWhite]}>
            {"BREAKING: TICKETS ON SALE FOR \"MINDS: FESTIVAL OF IDEAS\""}
          </Text>
          <Text style={[CS.bold, CS.colorWhite]}>
            {"@ RADIO CITY ON 6/13/2020. HELP US SELL OUT FAST!"}
          </Text>

        <Text style={[styles.modalCloseIcon, CS.colorWhite, CS.bold]} onPress={this.dismissForLogged}>[Close]</Text>
      </View>
    );
  }
}

const topPosition = Platform.OS === 'ios' ? (isIphoneX ? 40 : 30) : 0;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4690df',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  body: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
});
