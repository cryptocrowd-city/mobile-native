import React, { useRef, useCallback, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View, Text, StyleSheet } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { TokensOptions } from '../WalletTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import type { WalletStoreType } from '../createWalletStore';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import TokensOverview from './TokensOverview';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';
import TransactionsList from '../TransactionList/TransactionsList';
import ReceiverSettings from '../address/ReceiverSettings';
import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../WalletScreen';
import PhoneValidationComponent from '../../../common/components/PhoneValidationComponent';
import i18n from '../../../common/services/i18n.service';

const options: Array<ButtonTabType<TokensOptions>> = [
  { id: 'overview', title: 'Overview' },
  { id: 'transactions', title: 'Transactions' },
  { id: 'settings', title: 'Settings' },
];

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
};

const createStore = (walletStore: WalletStoreType) => ({
  option: walletStore.initialTab || ('overview' as TokensOptions),
  showPopup: false,
  setShowPopup(show: boolean) {
    this.showPopup = show;
  },
  setOption(option: TokensOptions) {
    this.option = option;
  },
});

type PhoneValidatorPropsType = {
  bottomStore: BottomOptionsStoreType;
};
const PhoneValidator = ({ bottomStore }: PhoneValidatorPropsType) => {
  const theme = ThemedStyles.style;
  const ref = useRef<PhoneValidationComponent>(null);
  const [msg, setMsg] = useState(i18n.t('wallet.phoneValidationMessage'));
  const [label, setLabel] = useState(i18n.t('onboarding.phoneNumber'));

  const verify = useCallback(() => {
    ref.current?.confirmAction();
    bottomStore.doneText = 'Done';
    setLabel('');
    bottomStore.setOnPressDone(() => bottomStore.hide());
  }, [ref, bottomStore]);

  const send = useCallback(() => {
    ref.current?.joinAction();
    bottomStore.doneText = 'Verify';
    bottomStore.setOnPressDone(verify);
    setMsg('');
    setLabel(i18n.t('onboarding.confirmationCode'));
  }, [ref, bottomStore, verify, setMsg, setLabel]);

  bottomStore.setOnPressDone(send);

  return (
    <View>
      <Text style={[theme.padding4x, theme.colorSecondaryText]}>{msg}</Text>
      <View
        style={[
          theme.backgroundPrimary,
          theme.borderPrimary,
          styles.inputWraper,
        ]}>
        <Text style={[theme.colorSecondaryText]}>{label}</Text>
        <PhoneValidationComponent
          textStyle={theme.colorPrimaryText}
          inputStyles={[theme.colorPrimaryText, theme.border0x, styles.input]}
          bottomStore={bottomStore}
          ref={ref}
        />
      </View>
    </View>
  );
};

const showPhoneValidator = (bottomStore: BottomOptionsStoreType) => {
  bottomStore.show(
    'Phone Verification',
    'Send',
    <PhoneValidator bottomStore={bottomStore} />,
  );
};

/**
 * Tokens tab
 */
const TokensTab = observer(
  ({ walletStore, navigation, bottomStore }: PropsType) => {
    const store = useLocalStore(createStore, walletStore);
    // clear initial tab
    // walletStore.setInitialTab(undefined);

    const { user } = useLegacyStores();
    const theme = ThemedStyles.style;
    const showSetup =
      !user.hasRewards() || !walletStore.wallet.receiver.address;
    let walletSetup;

    if (showSetup) {
      walletSetup = [
        {
          title: (
            <Text
              style={[
                theme.listItemTitle,
                user.hasRewards() ? theme.strikethrough : '',
              ]}>
              {'Phone Verification'}
            </Text>
          ),
          onPress: () => showPhoneValidator(bottomStore),
          icon: user.hasRewards()
            ? { name: 'md-checkmark', type: 'ionicon' }
            : undefined,
          noIcon: !user.hasRewards(),
        },
        {
          title: 'Add On-Chain Address',
          onPress: () => {
            if (!walletStore.wallet.receiver.address) {
              walletStore.createOnchain(true);
            }
          },
          icon: walletStore.wallet.receiver.address
            ? { name: 'md-checkmark' }
            : undefined,
          noIcon: !walletStore.wallet.receiver.address,
        },
      ];
    }

    let body;
    switch (store.option) {
      case 'overview':
        body = (
          <TokensOverview
            walletStore={walletStore}
            navigation={navigation}
            bottomStore={bottomStore}
          />
        );
        break;
      case 'transactions':
        body = (
          <TransactionsList
            navigation={navigation}
            currency="tokens"
            wallet={walletStore}
            bottomStore={bottomStore}
          />
        );
        break;
      case 'settings':
        body = (
          <ReceiverSettings navigation={navigation} walletStore={walletStore} />
        );
        break;
    }

    return (
      <ScrollView>
        {showSetup && (
          <View style={theme.paddingTop2x}>
            <MenuSubtitle>WALLET SETUP</MenuSubtitle>
            {walletSetup.map((item, i) => (
              <MenuItem item={item} key={i} />
            ))}
          </View>
        )}
        <View style={theme.paddingTop4x}>
          <TopBarButtonTabBar
            tabs={options}
            current={store.option}
            onChange={store.setOption}
          />
          {body}
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    height: 30,
    flexBasis: 0,
    flexGrow: 1,
    padding: 0,
  },
  inputWraper: {
    padding: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});

export default TokensTab;