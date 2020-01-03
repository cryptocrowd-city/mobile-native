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
import Input from '../../common/components/Input';

@inject('hashtag')
@observer
export default class ChannelSetupStepNew extends Component {

  state = {
    phoneNumber: '+1',
    location: '',
    birthDate: '',
  };

  setPhoneNumber = phoneNumber => this.setState({phoneNumber});
  setLocation = location => this.setState({location});
  setBirthDate = birthDate => this.setState({birthDate});

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
          <Text style={[CS.onboardingTitle, CS.marginTop3x, CS.marginBottom3x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <Text style={CS.onboardingSubtitle}>{i18n.t('onboarding.infoTitle')}</Text>
          <Text style={CS.onboardingSteps}>{i18n.t('onboarding.infoStep')}</Text>
        </View>
        <View style={styles.inputContainer}>
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
  bottom: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
    width: '80%',
    justifyContent: 'flex-end',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  inputContainer: {
    flex: 5,
    marginLeft: 20,
    marginRight: 20,
    width: '90%',
  },
  textsContainer: {
    flex: 2,
    alignItems: 'center',
  }
});