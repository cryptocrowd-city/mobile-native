import React, {
  Component
} from 'react';

import {
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Linking,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import authService from '../auth/AuthService';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import { CommonStyled } from '../styles/CommonStyled';
import styled from 'styled-components';

import { observer, inject } from 'mobx-react/native';

import {CheckBox} from 'react-native-elements'

import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import delay from '../common/helpers/delay';
import apiService from '../common/services/api.service';
import Input from '../common/components/Input';
import MindsLayout from '../common/components/MindsLayout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../common/components/Button';

/**
 * Register Form
 */
@inject('user')
@observer
export default class RegisterFormNew extends Component {
  state = {
    error: {},
    password: '',
    username: '',
    confirmPassword: '',
    email: '',
    termsAccepted: false,
    exclusive_promotions: false,
    inProgress: false,
  };

  validatePassword(value) {
    let error = this.state.error;
    if (this.state.password !== value) {
      error.confirmPasswordError = i18n.t('auth.confirmPasswordError');
    } else {
      error.confirmPasswordError = '';
    }
    this.setState({ error });
  }

  validateTerms(value) {
    let error = this.state.error;
    if(!this.state.termsAccepted && this.state.username.length > 4){
      error.termsAcceptedError = i18n.t('auth.termsAcceptedError');
    } else {
      error.termsAcceptedError = '';
    }
    this.setState({ termsAccepted: !!value, error });
  }

  setUsername = username => this.setState({username});
  setEmail = email => this.setState({email});
  setPassword = password => this.setState({password});
  setConfirmPassword = confirmPassword => this.setState({confirmPassword});

  getFormBody = () => {
    return (
      <ScrollView style={[CommonStyle.flexContainer]}>
        <View style={CommonStyle.marginBottom3x}>
          <TouchableOpacity onPress={this.props.onBack}>
            <Icon size={34} name="keyboard-arrow-left" color='#777777'/>
          </TouchableOpacity>
        </View>
        <View style={CommonStyle.marginBottom3x}>
          <TitleText>{i18n.t('auth.join')}</TitleText>
        </View>
        <View>
          <Text style={{color: '#F00', textAlign: 'center', paddingTop:4, paddingLeft:4}}>
            {this.state.error.termsAcceptedError}
          </Text>
        </View>
        <Input
          placeholder={i18n.t('auth.username')}
          onChangeText={this.setUsername}
          value={this.state.username}
          editable={!this.state.inProgress}
        />
        <Input
          placeholder={i18n.t('auth.email')}
          onChangeText={this.setEmail}
          value={this.state.email}
          editable={!this.state.inProgress}
        />
        <Input
          placeholder={i18n.t('auth.password')}
          secureTextEntry={true}
          onChangeText={this.setPassword}
          value={this.state.password}
          editable={!this.state.inProgress}
        />
        { this.state.password ?
          <Input
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={true}
            onChangeText={this.setConfirmPassword}
            value={this.state.confirmPassword}
            editable={!this.state.inProgress}
          /> : null }
        <CheckBox
          right
          iconLeft
          containerStyle={ComponentsStyle.registerCheckboxNew}
          title={<Text style={ComponentsStyle.termsNew}>{i18n.t('auth.accept')} <Text style={ComponentsStyle.linkNew} onPress={ ()=> Linking.openURL('https://www.minds.com/p/terms') }>{i18n.t('auth.termsAndConditions')}</Text></Text>}
          checked={this.state.termsAccepted}
          textStyle={ComponentsStyle.registerCheckboxTextNew}
          onPress={() => { this.setState({ termsAccepted: !this.state.termsAccepted }) }}
          disabled={this.state.inProgress}
        />
      </ScrollView>
    );
  };

  getFormFooter = () => {
    return (
      <View style={[styles.containerButton]}>
        <Button
          onPress={() => this.onPressRegister()}
          borderRadius={2}
          containerStyle={ComponentsStyle.loginButtonNew}
          loading={this.state.inProgress}
          loadingRight={true}
          disabled={this.state.inProgress}
        >
          <Text style={ComponentsStyle.loginButtonTextNew}>{i18n.t('auth.createChannel')}</Text>
        </Button>
        <SubTitle>
          {i18n.to('auth.alreadyHaveAccount', null, {
            login: (
              <Text style={[ComponentsStyle.linkNew, CommonStyle.fontL]} onPress={this.onPressBack}>
                {i18n.t('auth.login')}
              </Text>
            ),
          })}
        </SubTitle>
      </View>
    );
  };

  render() {
    return (
      <MindsLayout 
        body={this.getFormBody()}
        footer={this.getFormFooter()}
      />
    );
  }

  /**
   * On press back
   */
  onPressBack() {
    this.props.onBack();
  }

  /**
   * On press register
   */
  async onPressRegister() {
    this.validatePassword(this.state.confirmPassword);

    if (!this.state.termsAccepted) {
      return Alert.alert(
        i18n.t('ops'),
        i18n.t('auth.termsAcceptedError')
      );
    }

    if (this.state.error.confirmPasswordError) {
      return Alert.alert(
        i18n.t('ops'),
        i18n.t('auth.confirmPasswordError')
      );
    }

    this.setState({ inProgress: true });

    try {
      const params = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        exclusive_promotions: this.state.exclusive_promotions
      };
      await authService.register(params);
      sessionService.setInitialScreen('OnboardingScreenNew');
      await apiService.clearCookies();
      await delay(100);
      await authService.login(this.state.username ,this.state.password);
    } catch (err) {
      Alert.alert(
        i18n.t('ops'),
        err.message
      );
    }

    this.setState({ inProgress: false });
  }
}

const styles = StyleSheet.create({
  joinText: {
    color: '#4A4A4A',
    fontFamily: 'Roboto',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 37,
    textAlign: 'center',
    paddingTop: 25,
  },
  containerButton: {
    flex: 1,
  },
  button: {
    alignSelf: 'stretch',
  },
});

const TitleText = styled.Text`
  ${CommonStyled.textTitle} 
  color: ${(props) => props.theme['primary_text']};
  align-self: center;
`;

const SubTitle = styled.Text`
  ${CommonStyled.textSubTitle}
  color: ${(props) => props.theme['secondary_text']};
  align-self: center;
  margin-top: 20px;
`;
