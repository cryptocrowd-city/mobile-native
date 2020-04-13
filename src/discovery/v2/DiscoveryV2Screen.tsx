import React, { Component, Fragment, useEffect } from 'react';

import {
  Platform,
  Text,
  FlatList,
  View,
  TouchableHighlight,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';

import i18n from '../../common/services/i18n.service';

import { DiscoveryTrendsList } from './trends/DiscoveryTrendsList';
import Topbar from '../../topbar/Topbar';
import { TopbarTabbar } from './topbar/TopbarTabbar';
import {
  AppStackParamList,
  RootStackParamList,
} from 'src/navigation/NavigationTypes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList } from 'src/tabs/TabsScreenNew';
import { autorun, reaction } from 'mobx';
import { useStores } from '../../common/hooks/use-stores';

interface Props {}

/**
 * Discovery Feed Screen
 */

export const DiscoveryV2Screen = observer((props: Props) => {
  const { discoveryV2 } = useStores();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      discoveryV2.refreshTrends();
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Topbar
        title={i18n.t('tabTitleDiscovery')}
        navigation={navigation}
        style={[CS.shadow]}></Topbar>
      <TopbarTabbar></TopbarTabbar>

      {discoveryV2.activeTabId === 'foryou' ? (
        <DiscoveryTrendsList style={{ flex: 1 }}></DiscoveryTrendsList>
      ) : (
        <View></View>
      )}
    </View>
  );
});
