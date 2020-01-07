import React, { Component } from 'react';

import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import i18n from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Input from '../../common/components/Input';

import MindsLayout from '../../common/components/MindsLayout';
import styled from 'styled-components';
import { CommonStyled } from '../../styles/CommonStyled';
import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

export default class ChannelSetupStepNew extends Component {
  state = {
    phoneNumber: '+1',
    location: '',
    birthDate: '',
  };

  setPhoneNumber = phoneNumber => this.setState({phoneNumber});
  setLocation = location => this.setState({location});
  setBirthDate = birthDate => this.setState({birthDate});

  getBody = () => {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <TitleText>{i18n.t('onboarding.infoTitle')}</TitleText>
          <Step>{i18n.t('onboarding.step',{step: 2, total: 4})}</Step>
          <SubTitle>{i18n.t('onboarding.suggestedGroupsDescription')}</SubTitle>
        </View>
        <ScrollView style={styles.inputContainer}>
          <Input
            placeholder={i18n.t('onboarding.infoMobileNumber')}
            onChangeText={this.setPhoneNumber}
            value={this.state.phoneNumber}
            editable={true}
            optional={true}
            info={"Tu hermana"}
            inputType={'phoneInput'}
          />
          <Input
            placeholder={i18n.t('onboarding.infoLocation')}
            onChangeText={this.setLocation}
            value={this.state.location}
            editable={true}
            optional={true}
            info={"Tu hermana"}
          />
          <Input
            placeholder={i18n.t('onboarding.infoDateBirth')}
            onChangeText={this.setBirthDate}
            value={this.state.birthDate}
            editable={true}
            optional={true}
            info={"Tu hermana"}
            inputType={'dateInput'}
          />
        </ScrollView>
      </View>
    );
  };

  getFooter = () => {
    return <OnboardingButtons onNext={this.props.onNext} />;
  };

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
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flex: 6,
    width: '100%',
  },
  textsContainer: {
    flex: 1.5,
    alignItems: 'center',
  }
});