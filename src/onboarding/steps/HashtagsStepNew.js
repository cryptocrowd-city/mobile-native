import React, { Component } from 'react';

import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import TagSelect from '../../common/components/TagSelect';
import i18n from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';
import { TouchableOpacity } from 'react-native-gesture-handler';

import MindsLayout from '../../common/components/MindsLayout';
import styled from 'styled-components';
import { CommonStyled } from '../../styles/CommonStyled';
import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

@inject('hashtag')
@observer
export default class HashtagsStepNew extends Component {

  componentDidMount() {
    this.props.hashtag.setAll(true);
    this.props.hashtag.loadSuggested().catch(err => {
      logService.exception(err);
    });
  }

  getBody = () => {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <TitleText>{i18n.t('onboarding.hashtagTitle')}</TitleText>
          <Step>{i18n.t('onboarding.step',{step: 1, total: 4})}</Step>
          <SubTitle>{i18n.t('onboarding.hashtagInterest')}</SubTitle>
        </View>
        <View style={styles.hashtagContainer}>
          <TagSelect
            tagStyle={styles.hashtag}
            tagSelectedStyle={{borderColor: '#5DBAC0'}}
            textSelectedStyle={{color: '#5DBAC0'}}
            textStyle={styles.hashtagText}
            containerStyle={[CS.rowJustifyStart]}
            onTagDeleted={this.props.hashtag.deselect}
            onTagAdded={this.props.hashtag.select}
            tags={this.props.hashtag.suggested}
            disableSort={true}
          />
        </View>
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
  hashtagContainer: {
    flex: 3,
  },
  textsContainer: {
    flex: 4,
    alignItems: 'center',
  },
  hashtag: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#979797',
  },
  hashtagText: {
    color: '#AEB0B8',
    fontSize: 17,
  }
});