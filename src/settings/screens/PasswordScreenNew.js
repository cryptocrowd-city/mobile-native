//@ts-nocheck
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native-animatable';
import Input from '../../common/components/Input';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { DISABLE_PASSWORD_INPUTS } from '../../config/Config';
import { useNavigation } from '@react-navigation/native';
import validatePassword from '../../common/helpers/validatePassword';
import authService from '../../auth/AuthService';
import settingsService from '../SettingsService';
import { KeyboardAvoidingView, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import isIphoneX from '../../common/helpers/isIphoneX';
import PasswordValidator from '../../common/components/PasswordValidator';

export default function () {
  const theme = ThemedStyles.style;

  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState(false);

  const currentPasswordFocus = useCallback(() => setCurrentPassword(''), []);

  const newPasswordFocus = useCallback(() => {
    setNewPassword('');
    setPasswordFocused(true);
  }, []);

  const newPasswordBlurred = useCallback(() => setPasswordFocused(false), []);

  const confirmationPasswordFocus = useCallback(
    () => setConfirmationPassword(''),
    [],
  );

  const clearInputs = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmationPassword('');
  }, [setCurrentPassword, setNewPassword, setConfirmationPassword]);

  let currentPasswordInput = '';
  let newPasswordInput = '';

  const confirmPassword = useCallback(async () => {
    // missing data
    if (!currentPassword || !newPassword || !confirmationPassword) {
      return;
    }

    // current password doesn't match
    try {
      await authService.validatePassword(currentPassword);
    } catch (err) {
      currentPasswordInput.showError();
      return;
    }

    // password format is invalid
    if (!validatePassword(newPassword).all) {
      setError(true);
      return;
    }

    // passwords not matching
    if (newPassword !== confirmationPassword) {
      newPasswordInput.showError();
    }

    const params = {
      password: currentPassword,
      new_password: newPassword,
    }

    try {
      await settingsService.submitSettings(params);
      clearInputs();
      Alert.alert(i18n.t('success'), i18n.t('settings.passwordChanged'));
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }, [
    currentPassword,
    newPassword,
    confirmationPassword,
    currentPasswordInput,
    newPasswordInput,
    clearInputs,
  ]);

  /**
   * Set save button on header right
   */
  navigation.setOptions({
    headerRight: () => (
      <Text
        onPress={confirmPassword}
        style={[theme.colorLink, theme.fontL, theme.bold]}>
        {i18n.t('save')}
      </Text>
    ),
  });

  const getInput = useCallback(
    (props) => {
      const wrapperStyle = [
        theme.paddingLeft3x,
        theme.paddingTop3x,
        theme.backgroundSecondary,
        theme.border,
        theme.borderPrimary,
      ];

      const labelStyle = [
        theme.colorSecondaryText,
        theme.fontL,
        theme.paddingLeft,
      ];

      return (
        <View style={wrapperStyle}>
          <Input
            style={[theme.border0x, styles.inputHeight]}
            labelStyle={labelStyle}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            value={props.value}
            testID={props.testID}
            clearTextOnFocus={true}
            secureTextEntry={!DISABLE_PASSWORD_INPUTS}
            onFocus={props.onFocus}
            onBlur={props.onBlur ?? (() => {})}
            onError={props.onError ?? (() => {})}
            ref={props.ref ?? (() => {})}
          />
        </View>
      );
    },
    [theme]
  );

  return (
    <ScrollView style={[theme.flexContainer, theme.backgroundPrimary]}>
      <KeyboardAvoidingView
        style={[theme.flexContainer, theme.paddingTop3x]}
        behavior="position"
        keyboardVerticalOffset={isIphoneX ? 100 : 64}>
        {passwordFocused ? (
          <View style={[theme.paddingLeft3x]}>
            <PasswordValidator password={newPassword} />
          </View>
        ) : (
          getInput({
            placeholder: i18n.t('settings.currentPassword'),
            onChangeText: setCurrentPassword,
            value: currentPassword,
            testID: 'currentPasswordInput',
            onFocus: currentPasswordFocus,
            onError: i18n.t('settings.invalidPassword'),
            ref: (input) => (currentPasswordInput = input),
          })
        )}
        {getInput({
          placeholder: i18n.t('settings.newPassword'),
          onChangeText: setNewPassword,
          value: newPassword,
          testID: 'newPasswordInput',
          onFocus: newPasswordFocus,
          onBlur: newPasswordBlurred,
          onError: i18n.t('settings.passwordsNotMatch'),
          ref: (input) => (newPasswordInput = input)
        })}
        {getInput({
          placeholder: i18n.t('settings.confirmNewPassword'),
          onChangeText: setConfirmationPassword,
          value: confirmationPassword,
          testID: 'confirmationPasswordPasswordInput',
          onFocus: confirmationPasswordFocus,
          onBlur: newPasswordBlurred,
        })}
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = {
  inputHeight: {
    height: 40,
  },
};