import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import colors from '../../styles/Colors';
import { ListItem } from 'react-native-elements';
import logService from '../../common/services/log.service';
import i18nService from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';

import Icon from 'react-native-vector-icons/Ionicons';
import MindsLayout from '../../common/components/MindsLayout';
import styled from 'styled-components';
import { CommonStyled } from '../../styles/CommonStyled';
import Button from '../../common/components/Button';

@inject('user')
@observer
export default class WelcomeStep extends Component {

  getBody = () => {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <Image
          source={require('./../../assets/welcome.png')}
          style={[styles.welcome, CS.marginTop4x, CS.marginBottom3x]}
        />
        <TitleText>@{this.props.user.me.name}</TitleText>

        <Welcome>{i18nService.t('onboarding.welcomeNew')}</Welcome>

        <Privacy>{i18nService.t('onboarding.welcomePrivacy')}</Privacy>
      </View>
    );
  };

  getFooter = () => {
    return (
      <View style={CS.flexContainer}>
        <Button
          onPress={this.props.onNext}
          borderRadius={2}
          containerStyle={ComponentsStyle.loginButtonNew}
        >
          <Text style={ComponentsStyle.loginButtonTextNew}>{i18nService.t('onboarding.welcomeSetup')}</Text>
        </Button>
         <Text style={[CS.linkNew, styles.later]} onPress={ this.props.onFinish }>{i18nService.t('onboarding.welcomeLater')}</Text>
      </View>
    )
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={CS.flexContainer}>
        <MindsLayout
          body={this.getBody()}
          footer={this.getFooter()}
        />
      </View>
    );
  }
}

const TitleText = styled.Text`
  ${CommonStyled.textTitle} 
  color: ${(props) => props.theme['primary_text']};
  margin-bottom: 20px;
`;

const Welcome = styled.Text`
  ${CommonStyled.textSubTitle}
  color: ${(props) => props.theme['primary_text']}
  margin-bottom: 20px;
`;

const Privacy = styled.Text`
  ${CommonStyled.textSubTitle}
  color: ${(props) => props.theme['secondary_text']}
  margin-top: 20px;
`;

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
    alignSelf: 'stretch',
    backgroundColor: "#5DBAC0",
    borderRadius: 2,
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
  },
  later: {
    alignSelf: 'center',
    marginTop: 20
  },
  welcome: {
    height: 36,
    width: 36,
  }
});
