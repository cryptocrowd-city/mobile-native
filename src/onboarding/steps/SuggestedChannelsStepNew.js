import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  I18nManager,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import DiscoveryUserNew from '../../discovery/DiscoveryUserNew';
import i18n from '../../common/services/i18n.service';

import MindsLayout from '../../common/components/MindsLayout';
import styled from 'styled-components';
import { CommonStyled } from '../../styles/CommonStyled';
import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

@inject('discovery')
@observer
export default class SuggestedChannelsStepNew extends Component {

  constructor(props) {
    super(props);

    this.props.discovery.init();
    this.props.discovery.filters.setType('channels');
    this.props.discovery.filters.setPeriod('30d');
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    
  }

  /**
   * Render user
   */
  renderUser = (user, index) => {
    return <DiscoveryUserNew
      row={{item: user}}
      key={user.guid}
      testID={`suggestedUser${index}`}
    />
  }

  getBody = () => {
    const discovery = this.props.discovery;

    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <TitleText>{i18n.t('onboarding.suggestedChannels')}</TitleText>
          <Step>{i18n.t('onboarding.step',{step: 4, total: 4})}</Step>
          <SubTitle>{i18n.t('onboarding.suggestedChannelsDescription')}</SubTitle>
        </View>
        <ScrollView style={styles.channelContainer}>
        {!discovery.listStore.loaded && <ActivityIndicator />}
        {discovery.listStore.entities.slice().map((user, i) => this.renderUser(user, i))}
        </ScrollView>
      </View>
    );
  }

  getFooter = () => {
    return <OnboardingButtons onNext={this.props.onNext} />;
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
`;

const SubTitle = styled.Text`
  ${CommonStyled.textSubTitle}
  color: ${(props) => props.theme['primary_text']}
  margin-bottom: 20px;
  margin-top: 25;
`;

const Step = styled.Text`
  ${CommonStyled.textSubTitle}
  color: ${(props) => props.theme['secondary_text']}
`;

const styles = StyleSheet.create({
  channelContainer: {
    width: '100%',
  },
  textsContainer: {
    alignItems: 'center',
  },
});