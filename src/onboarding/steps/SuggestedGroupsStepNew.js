import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import GroupsListItem from '../../groups/GroupsListItem';
import i18n from '../../common/services/i18n.service';

import MindsLayout from '../../common/components/MindsLayout';
import styled from 'styled-components';
import { CommonStyled } from '../../styles/CommonStyled';
import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

@inject('groups', 'hashtag')
@observer
export default class SuggestedGroupsStepNew extends Component {

  componentDidMount() {
    this.props.hashtag.setAll(true);
    this.props.groups.reset();
    this.props.groups.loadList('suggested');
  }

  renderGroup = (group) => {
    return  <GroupsListItem key={group.guid} group={group}/>
  }

  getBody = () => {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <TitleText>{i18n.t('onboarding.groupTitle')}</TitleText>
          <Step>{i18n.t('onboarding.step',{step: 1, total: 4})}</Step>
          <SubTitle>{i18n.t('onboarding.suggestedGroupsDescription')}</SubTitle>
        </View>
        <ScrollView style={styles.groupContainer}>
          {this.props.groups.list.entities.map(group => this.renderGroup(group))}
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
  groupContainer: {
    flex: 3.5,
    width: '100%',
  },
  textsContainer: {
    flex: 1.5,
    alignItems: 'center',
  },
});