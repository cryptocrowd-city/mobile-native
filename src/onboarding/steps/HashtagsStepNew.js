import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import TagSelect from '../../common/components/TagSelect';
import TagInput from '../../common/components/TagInput';
import i18n from '../../common/services/i18n.service';
import { Button } from 'react-native-elements';
import { ComponentsStyle } from '../../styles/Components';
import { TouchableOpacity } from 'react-native-gesture-handler';

@inject('hashtag')
@observer
export default class HashtagsStepNew extends Component {

  componentDidMount() {
    this.props.hashtag.setAll(true);
    this.props.hashtag.loadSuggested().catch(err => {
      logService.exception(err);
    });
  }

  render() {
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <View style={styles.textsContainer}>
          <Text style={[CS.onboardingTitle, CS.marginTop4x, CS.marginBottom3x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <Text style={CS.onboardingSubtitle}>{i18n.t('onboarding.hashtagTitle')}</Text>
          <Text style={CS.onboardingSteps}>{i18n.t('onboarding.hashtagStep')}</Text>
          <Text style={[CS.linkNew, CS.marginTop4x, CS.marginBottom3x]}>{i18n.t('onboarding.hashtagInterest')}</Text>
        </View>
        <View style={styles.hashtagContainer}>
          <TagSelect
            tagStyle={[CS.backgroundWhite]}
            textSelectedStyle={{color: '#5DBAC0'}}
            textStyle={[CS.fontL, CS.colorDarkGreyed]}
            containerStyle={[CS.rowJustifyStart]}
            onTagDeleted={this.props.hashtag.deselect}
            onTagAdded={this.props.hashtag.select}
            tags={this.props.hashtag.suggested}
            disableSort={true}
          />
        </View>
        <View style={[styles.containerButton]}>
            <TouchableOpacity style={styles.skip} onPress={this.props.onNext}>
              <Text style={styles.skipText}>{i18n.t('onboarding.skipStep')}</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.continue} onPress={this.props.onNext}>
              <Text style={styles.continueText}>{i18n.t('continue')}</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerButton: {
    flex: 2,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 40,
    justifyContent: 'flex-end',
    width: '80%',
  },
  continue: {
    backgroundColor: "#5DBAC0",
    borderRadius: 2,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "500",
  },
  skip: {
    backgroundColor: "transparent",
    borderRadius: 2,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  skipText: {
    color: '#9B9B9B',
    fontSize: 16,
    lineHeight: 21,
  },
  hashtagContainer: {
    flex: 3,
    marginLeft: 20,
    marginRight: 20,
  },
  textsContainer: {
    flex: 3,
    alignItems: 'center',
  }
});