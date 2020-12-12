import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable, Linking } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';
import { Text } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { ThemedStyle } from '../styles/Style';
import UniswapWidget from './uniswap-widget/UniswapWidget';
import TransakWidget, {
  TransakOrderProcessed,
} from './transak-widget/TransakWidget';
import OrderReportModal, {
  OrderReport,
} from './order-report-modal/OrderReportModal';
import { startCase as _startCase } from 'lodash';

type PaymentMethod = 'card' | 'bank' | 'crypto';
type PaymentOption = { type: PaymentMethod; name: string };

const styles = StyleSheet.create({
  optionsContainer: {
    height: 70,
  },
  option: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstOption: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastOption: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  learMoreLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    color: '#cccccc',
  },
  closeButton: {
    zIndex: 999,
    position: 'absolute',
    right: -10,
    top: -10,
  },
});

const paymentMethodsList: PaymentOption[] = [
  { type: 'card', name: 'Card' },
  { type: 'bank', name: 'Bank' },
  { type: 'crypto', name: 'Crypto' },
];

const buildButtonStyles = (theme: ThemedStyle, position: number) => {
  switch (position) {
    case 0:
      return [styles.firstOption, theme.border2x];
    case 1:
      return [theme.borderTop2x, theme.borderBottom2x];
    case 2:
      return [styles.lastOption, theme.border2x];
    default:
      return [];
  }
};

export default function () {
  const theme = ThemedStyles.style;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [showUniswapWidget, setShowUniswapWidget] = useState(false);
  const [showTransakWidget, setShowTransakWidget] = useState(false);
  const [aggressTerms, setAggressTerms] = useState(false);
  const [orderReport, setOrderReport] = useState<OrderReport | null>(null);
  const [showOrderReport, setShowOrderReport] = useState(true);
  const canBuyTokens = !!paymentMethod && aggressTerms;

  const toggleUniswapModal = () => setShowUniswapWidget(!showUniswapWidget);
  const toggleTransakModal = () => setShowTransakWidget(!showTransakWidget);
  const toggleAgreesTerms = () => setAggressTerms(!aggressTerms);
  const toggleOrderReportModal = () => setShowOrderReport(!showOrderReport);

  const handleOptionSelection = (newType: PaymentMethod) => {
    setPaymentMethod((prevType) => {
      const isDeselection = prevType === newType;
      return isDeselection ? null : newType;
    });
  };

  const handleTransakOrderProcessed = useCallback(
    (order: TransakOrderProcessed) => {
      const { cryptoAmount, fiatAmount, fiatCurrency, paymentOptionId } = order;
      console.log(_startCase(paymentOptionId));
      setOrderReport({
        fiatAmount,
        fiatCurrency,
        tokenAmount: cryptoAmount,
        paymentMethod: _startCase(paymentOptionId),
      });
    },
    [],
  );

  const handleTransakError = useCallback((data) => {
    console.error(data);
  }, []);

  const handleBuy = () => {
    if (paymentMethod === 'crypto') {
      toggleUniswapModal();
    } else {
      toggleTransakModal();
    }
  };

  useEffect(() => {
    if (orderReport) {
      setShowTransakWidget(false);
      setShowOrderReport(true);
    }
  }, [orderReport]);

  return (
    <>
      <ScrollView
        style={[theme.flexContainer, theme.backgroundPrimary]}
        contentContainerStyle={theme.padding4x}>
        <View style={[theme.alignCenter]}>
          <Text style={[theme.marginBottom5x, theme.fontXXL, theme.bold]}>
            Payment Method
          </Text>
        </View>
        <View
          style={[
            theme.flexContainer,
            theme.rowJustifySpaceBetween,
            theme.marginBottom5x,
            styles.optionsContainer,
          ]}>
          {paymentMethodsList.map(({ type, name }, index) => (
            <Pressable
              style={[
                theme.borderPrimary,
                styles.option,
                ...buildButtonStyles(theme, index),
                paymentMethod === type ? theme.backgroundSecondary : '',
              ]}
              onPress={() => handleOptionSelection(type)}>
              <Text>{name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={[theme.flexContainer, theme.rowStretch]}>
          <Text>
            {'Deliver Estimate: '}
            <Text>{`1-2 ${
              paymentMethod === 'bank' ? 'days' : 'minutes'
            }`}</Text>
          </Text>
        </View>
        <View>
          <CheckBox
            checked={aggressTerms}
            onPress={toggleAgreesTerms}
            containerStyle={[theme.checkbox]}
            title={
              <Text style={[theme.colorPrimaryText, theme.marginLeft3x]}>
                {'I have read and accept the '}
                <Text
                  style={theme.link}
                  onPress={() => {
                    Linking.openURL(
                      'https://cdn-assets.minds.com/front/dist/assets/documents/TermsOfSale-v0.1.pdf',
                    );
                  }}>
                  Terms Of Sale
                </Text>
                {' for the Minds Token.'}
              </Text>
            }
          />
        </View>
        <View style={[theme.flexContainer, theme.rowJustifySpaceBetween]}>
          <Text style={styles.learMoreLink}>Learn more about tokens</Text>
          <Button
            text="Buy Tokens"
            containerStyle={[
              theme.alignCenter,
              !canBuyTokens ? styles.disabledButton : '',
            ]}
            onPress={handleBuy}
            disabled={!canBuyTokens}
          />
        </View>
      </ScrollView>
      <UniswapWidget
        isVisible={showUniswapWidget}
        onCloseButtonPress={toggleUniswapModal}
      />
      <TransakWidget
        isVisible={showTransakWidget}
        onOrderProcessed={handleTransakOrderProcessed}
        onError={handleTransakError}
        onCloseButtonPress={toggleTransakModal}
      />
      {orderReport && (
        <OrderReportModal
          isVisible={showOrderReport}
          onCloseButtonPress={toggleOrderReportModal}
          report={orderReport}
        />
      )}
    </>
  );
}
