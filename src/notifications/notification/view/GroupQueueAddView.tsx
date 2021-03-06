import React, { Component } from 'react';

import { Text, View } from 'react-native';
import NotificationBody from '../NotificationBody';
import type { PropsType } from './NotificationTypes';

/**
 * Group Queue Add Component
 */
export default class GroupQueueAddView extends Component<PropsType> {
  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.push('GroupView', {
      guid: this.props.entity.params.group.guid,
    });
  };

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToGroup}
        entity={entity}>
        <View style={styles.bodyContents}>
          <Text>
            Your post for{' '}
            <Text style={styles.link}>{entity.params.group.name}</Text> is
            awaiting approval from group administrators
          </Text>
        </View>
      </NotificationBody>
    );
  }
}
