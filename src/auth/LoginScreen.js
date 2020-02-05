import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Keyboard,
  Animated,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import LoginForm from './LoginForm';
import logService from '../common/services/log.service';
import i18nService from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';

import ThemedStyles from '../styles/ThemedStyles';
import { ScrollView } from 'react-native-gesture-handler';

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

    // Setting this here because if user register, then onboarding then logout and login again, will go to onboarding again
    sessionService.setInitialScreen('Tabs');

    this.setState({ loading:true });
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
    const CS = ThemedStyles.style;
    return (
      <View style={[CS.flexContainer, CS.paddingVertical6x]}>
        <Image
          source={require('./../assets/logos/bulb.png')}
          style={styles.bulb}
        />
        <LoginForm
          onLogin={() => this.login()}
          onForgot={this.onPressForgot}
        />
      </View>
    );
  };

  getLoginFooter = () => {
    const CS = ThemedStyles.style;
    return (
      <TouchableOpacity onPress={this.onPressRegister} testID="registerButton">
        <View style={CS.flexColumnCentered}>
          <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18nService.t('auth.haveAccount')}</Text>
          <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18nService.t('auth.createChannel')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render
   */
  render() {
    const CS = ThemedStyles.style;

    return (
      <View style={[CS.flexContainerCenter]}>
        <View style={[ CS.backgroundThemePrimary, styles.flex10]}>
          <SafeAreaView style={CS.flexContainer}>
            <ScrollView style={[CS.flexContainer, CS.paddingHorizontal4x]}>
              {this.getLoginBody()}
            </ScrollView>
          </SafeAreaView>
        </View>
        <View style={[CS.mindsLayoutFooter, CS.backgroundThemeSecondary]}>
          {this.getLoginFooter()}
        </View>
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
    this.props.navigation.push('Register');
  }

  /**
   * On login successful
   */
  login() {
    logService.info('user logged in');
  }
}

const styles = StyleSheet.create({
  flex10: {
    flex: 10,
  },
  bulb: {
    width: 47,
    height: 80,
    alignSelf: 'center',
    marginTop: 10
  },
});
