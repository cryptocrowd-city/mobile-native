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
          <Text style={[CS.fontM, CS.marginTop4x, CS.marginBottom3x]}>{i18n.t('onboarding.hashtagInterest')}</Text>
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
            <Button
              onPress={this.props.onNext}
              title={i18n.t('onboarding.skip')}
              backgroundColor="#FFF"
              borderRadius={2}
              containerViewStyle={[styles.button, ComponentsStyle.loginButton]}
              textStyle={ComponentsStyle.loginButtonText}
            />
            <Button
              onPress={this.props.onNext}
              title={i18n.t('continue')}
              backgroundColor="#5DBAC0"
              borderRadius={2}
              containerViewStyle={[styles.button, ComponentsStyle.loginButton]}
              textStyle={ComponentsStyle.loginButtonText}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerButton: {
    flex: 2,
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 20,
    justifyContent: 'flex-end',
    width: '80%',
  },
  button: {
    marginTop: 40,
    alignSelf: 'stretch',
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