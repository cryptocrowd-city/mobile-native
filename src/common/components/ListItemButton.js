import React, {Component} from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';

export default class ListItemButton extends Component {
  render() {
    return (
        <TouchableOpacity
          onPress={this.props.onPress}
          borderRadius={2}
          style={styles.container}>
            {this.props.children}
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderColor: '#404A4E',
    borderWidth: 1,
    padding:4,
  }
});