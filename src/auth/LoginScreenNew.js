import React, {
  Component
} from 'react';

import {inject, observer} from 'mobx-react/native'
import { StackActions, NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';

import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Button,
  Keyboard,
  Animated,
  Platform,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import LoginFormNew from './LoginFormNew';
import VideoBackground from '../common/components/VideoBackground';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import logService from '../common/services/log.service';
import featuresService from '../common/services/features.service';
import MindsLayout from '../common/components/MindsLayout';
import i18nService from '../common/services/i18n.service';

import styled from 'styled-components';
import { CommonStyled } from '../styles/CommonStyled';

const LOGO_HEIGHT = 100;
const LOGO_HEIGHT_SMALL = 50;

/**
 * Login screen
 */
export default class LoginScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.logoHeight = new Animated.Value(LOGO_HEIGHT);
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.logoHeight, {
      duration: event.duration,
      toValue: LOGO_HEIGHT_SMALL,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.logoHeight, {
      duration: event.duration,
      toValue: LOGO_HEIGHT,
    }).start();
  };

  getLoginBody = () => {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.paddingTop2x]}>
        <Image
          source={require('./../assets/logos/bulb.png')}
          style={styles.bulb}
        />
        <LoginFormNew
          onLogin={() => this.login()}
          onForgot={this.onPressForgot}
        />
      </View>
    );
  };

  getLoginFooter = () => {
    return (
      <TouchableOpacity onPress={this.onPressRegister}>
        <FooterContainer>
          <SubTitle>{i18nService.t('auth.haveAccount')}</SubTitle>
          <TitleText>{i18nService.t('auth.createChannel')}</TitleText>
        </FooterContainer>
      </TouchableOpacity>
    );
  };

  /**
   * Render
   */
  render() {
    const resizeMode = 'center';

    const body = this.getLoginBody();
    const footer = this.getLoginFooter();

    return (
      <View style={CommonStyle.flexContainer}>
        <MindsLayout
          body={body}
          footer={footer}
          footerBackground={'secondary_background'}
        />
      </View>
    );
  }

  /**
   * On press forgot
   */
  onPressForgot = () => {
    this.props.navigation.push('Forgot');
  }

  /**
   * On press register
   */
  onPressRegister = () => {
    if (featuresService.has('register_pages-december-2019')) {
      this.props.navigation.push('RegisterNew');
    } else {
      this.props.navigation.push('Register');
    }
  }

  /**
   * On login successful
   */
  login() {
    logService.info('user logged in');
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 84,
    marginBottom: 30,
    alignSelf: 'center',
  },
  bulb: {
    width: 34.72,
    height: 59.51,
    alignSelf: 'center',
    marginTop: 10
  },
});

const FooterContainer = styled.View`${CommonStyled.flexColumnCentered}`;

const TitleText = styled.Text`
  ${CommonStyled.textTitle} 
  color: ${(props) => props.theme['primary_text']}
`;

const SubTitle = styled.Text`
  ${CommonStyled.textSubTitle}
  color: ${(props) => props.theme['secondary_text']}
`;
