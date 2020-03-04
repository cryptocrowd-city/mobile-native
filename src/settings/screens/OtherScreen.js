import React, { useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import SettingsItem from '../SettingsItem';
import ThemedStyles from '../../styles/ThemedStyles';

export default function({ navigation }) {
  const CS = ThemedStyles.style;

  const contentAdmin = [
    {
      title: 'Reported Content',
      onPress: '',
    },
    {
      title: 'Blocked Channels',
      onPress: '',
    },
  ];

  const paidContent = [
    {
      title: 'Subscription Tier Management',
      onPress: '',
    },
    {
      title: 'Post Preview',
      onPress: '',
    },
  ];

  const account = [
    {
      title: 'Deactivate Account',
      onPress: '',
    },
    {
      title: 'Delete Account',
      onPress: '',
    },
  ];

  const subTitle = [
    CS.colorTertiaryText, 
    CS.fontM,
    CS.paddingLeft3x,
  ];


  return (
    <View style={[CS.flexContainer, CS.backgroundPrimary, CS.borderHair, CS.borderPrimary]}>

      <Text style={[subTitle, styles.subTitle]} >CONTENT ADMIN</Text>
      {contentAdmin.map((item, i) => (<SettingsItem item={item} i={i} />))}

      <Text style={[subTitle, styles.subTitle]} >PAID CONTENT</Text>
      {paidContent.map((item, i) => (<SettingsItem item={item} i={i} />))}

      <Text style={[subTitle, styles.subTitle]} >ACCOUNT</Text>
      {account.map((item, i) => (<SettingsItem item={item} i={i} />))}

    </View>
  )
}

const styles = {
  subTitle: {
    lineHeight: 35,
    paddingTop: 10,
  },
};