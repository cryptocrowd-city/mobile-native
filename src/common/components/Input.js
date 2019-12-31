import React, { Component } from 'react';
import {TextInput, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { ComponentsStyle } from '../../styles/Components';
import i18n from '../services/i18n.service';
import { CommonStyle } from '../../styles/Common';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneInput from 'react-native-phone-input';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class Input extends Component {

  state = {
    datePickerVisible: false,
  };

  showDatePicker = () => {
    this.setState({ datePickerVisible: true });
  }

  dismissDatePicker = () => {
    this.setState({ datePickerVisible: false });
  }

  confirmDatePicker = (date) => {
    this.props.onChangeText(date.toLocaleDateString());
    this.dismissDatePicker();
  }

  textInput = () => {
    return (
      <TextInput
        {...this.props}
        style={[ComponentsStyle.loginInputNew, styles.shadow, this.props.style]}
        placeholderTextColor="#444"
        returnKeyType={'done'}
        autoCapitalize={'none'}
        underlineColorAndroid='transparent'
        placeholder=''
      />
    );
  }
  
  phoneInput = () => {
    return (
      <PhoneInput
        {...this.props}
        style={[ComponentsStyle.loginInputNew, styles.shadow, this.props.style]}
        onChangePhoneNumber={this.props.onChangeText}
        ref="phoneInput"
        placeholder=''
      />
    );
  }

  dateInput = () => {
    return (
      <View>
      <TouchableOpacity
        {...this.props}
        style={[ComponentsStyle.loginInputNew, styles.shadow, this.props.style]}
        placeholderTextColor="#444"
        returnKeyType={'done'}
        autoCapitalize={'none'}
        underlineColorAndroid='transparent'
        placeholder=''
        onPress={this.showDatePicker}
      >
        <Text>{this.props.value}</Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={this.state.datePickerVisible}
        onConfirm={this.confirmDatePicker}
        date={new Date()}
        onCancel={this.dismissDatePicker}
        mode='date'
      />
      </View>
    );
  }

  renderInput = () => {
    const inputType = this.props.inputType;
    if (inputType) {
      switch(inputType) {
        case 'textInput':
          return this.textInput();
        case 'phoneInput':
          return this.phoneInput();
        case 'dateInput':
          return this.dateInput();
      }
    }
    return this.textInput();
  }

  render() {
    const optional = (<Text style={[styles.optional, CommonStyle.marginBottom2x]}>{"Optional"}</Text>);
    const info = (<IconMC name="information-variant" size={16} />);

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.marginTop2x]}>
        <View style={styles.row}>
          <View style={styles.row}>
            <Text style={[styles.label]}>{this.props.placeholder}</Text>
            {this.props.info && info}
          </View>
          {this.props.optional && optional}
        </View>
        {this.renderInput()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#9B9B9B',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginLeft: 20,
    marginRight: 5,
  },
  optional: {
    color: '#9B9B9B',
    fontSize: 14,
    fontFamily: 'Roboto-Italic',
    marginRight: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});
