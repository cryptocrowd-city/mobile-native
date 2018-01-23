import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';

import { observer, inject } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';

@inject('user')
@inject('notifications')
@inject('wallet')
@observer
export default class Topbar extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')} >
            <View style={styles.topbarLeft}>
              <Icon name="bell" size={18} color='#444' style={ styles.button } />
              <Text>{this.props.notifications.unread}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.topbarCenter}>
            <Avatar
              rounded
              source={{ uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid }}
              width={36}
              height={36}
              onPress={() => this.props.navigation.navigate('Channel', { guid: this.props.user.me.guid })}
            />
          </View>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('Wallet', { navigation: this.props.navigation })} >
            <View style={styles.topbarRight}>
              <Icon name="bank" size={18} color='#444' style={ styles.button }/>
              <Text>{ this.props.wallet.pointsFormatted }</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios'?12:0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  topbar: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  topbarCenter: {
    flex: 1,
    alignItems: 'center',
    padding: 2,
  },
  topbarRight: {
    width:100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 10
  },
  button: {
    padding: 8,
  }
});
