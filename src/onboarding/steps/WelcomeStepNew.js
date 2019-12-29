import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import colors from '../../styles/Colors';
import { ListItem, Button } from 'react-native-elements';
import logService from '../../common/services/log.service';
import i18nService from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';

import Icon from 'react-native-vector-icons/Ionicons';

@inject('user')
@observer
export default class WelcomeStep extends Component {

  /**
   * Render
   */
  render() {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <Icon name="md-thumbs-up" size={36} color="#FED12F" style={{paddingTop:1}}/>
        <Text style={CS.onboardingTitle}>{i18nService.t('onboarding.welcomeNew')}</Text>

        <Text style={CS.onboardingSubtitle}>@{this.props.user.me.name}</Text>

        <Text style={styles.privacy}>{i18nService.t('onboarding.welcomePrivacy')}</Text>

        <View style={[styles.containerButton]}>
            <Text style={[CS.linkNew, {alignSelf: 'center'}]} onPress={ this.props.onFinish }>{i18nService.t('onboarding.welcomeLater')}</Text>
            <Button
              onPress={this.props.onNext}
              title={i18nService.t('onboarding.welcomeSetup')}
              backgroundColor="#5DBAC0"
              borderRadius={2}
              containerViewStyle={[styles.button, ComponentsStyle.loginButton]}
              textStyle={ComponentsStyle.loginButtonText}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerButton: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 20,
    justifyContent: 'flex-end',
    width: '80%',
  },
  button: {
    marginTop: 40,
    alignSelf: 'stretch',
  },
  privacy: {
    color: '#9B9B9B',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 50,
  }
});
