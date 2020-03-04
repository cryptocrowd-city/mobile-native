import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import SettingsItem from './SettingsItem';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';

export default function({ navigation }) {
  const CS = ThemedStyles.style;

  const navToAccount = useCallback(() => navigation.push('Account'), [
    navigation,
  ]);

  const navToSecurity = useCallback(() => navigation.push('Security'), [
    navigation,
  ]);

  const navToBilling = useCallback(() => navigation.push('Billing'), [
    navigation,
  ]);


  const navToOther = useCallback(() => navigation.push('Other'), [
    navigation,
  ]);

  const keyExtractor = useCallback((item, index) => index.toString());

  const list = [
    {
      title: i18n.t('settings.account'),
      onPress: navToAccount,
    },
    {
      title: i18n.t('settings.security'),
      onPress: navToSecurity,
    },
    {
      title: i18n.t('settings.billing'),
      onPress: navToBilling,
    },
    {
      title:i18n.t('settings.other'),
      onPress: navToOther,
    },
  ]

  return (
    <View style={[CS.flexContainer, CS.backgroundPrimary, CS.borderHair, CS.borderPrimary]}>
      <FlatList
        data={list}
        renderItem={SettingsItem}
        style={[CS.backgroundPrimary]}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}