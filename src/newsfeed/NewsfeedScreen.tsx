import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { View } from 'react-native';

import FeedList from '../common/components/FeedList';
import type { AppStackParamList } from '../navigation/NavigationTypes';
import type MessengerListStore from '../messenger/MessengerListStore';
import type UserStore from '../auth/UserStore';
import type NewsfeedStore from './NewsfeedStore';
import type NotificationsStore from '../notifications/NotificationsStore';
import CheckLanguage from '../common/components/CheckLanguage';
import ActivityPlaceHolder from './ActivityPlaceHolder';
import PortraitContentBar from '../portrait/PortraitContentBar';

type NewsfeedScreenRouteProp = RouteProp<AppStackParamList, 'Newsfeed'>;
type NewsfeedScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Newsfeed'
>;

type PropsType = {
  navigation: NewsfeedScreenNavigationProp;
  user: UserStore;
  messengerList: MessengerListStore;
  notifications: NotificationsStore;
  newsfeed: NewsfeedStore<any>;
  route: NewsfeedScreenRouteProp;
};

/**
 * News Feed Screen
 */
@inject('newsfeed', 'user', 'messengerList', 'notifications')
@observer
class NewsfeedScreen extends Component<PropsType> {
  disposeTabPress?: Function;
  portraitBar = React.createRef<any>();
  contentSizeChangeTimeout: any = 0;
  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.navigate('Capture', {});
  };

  refreshNewsfeed = (e) => {
    if (this.props.navigation.isFocused()) {
      this.props.newsfeed.scrollToTop();
      this.props.newsfeed.feedStore.refresh();
      e && e.preventDefault();
    }
  };

  /**
   * Load data on mount
   */
  componentDidMount() {
    this.disposeTabPress = this.props.navigation.addListener(
      //@ts-ignore
      'tabPress',
      this.refreshNewsfeed,
    );

    this.loadFeed();
    // this.props.newsfeed.loadBoosts();
  }

  async loadFeed() {
    // this.props.discovery.init();

    await this.props.newsfeed.feedStore.fetchRemoteOrLocal();

    // load messenger
    this.props.messengerList.loadList();

    // listen socket on app start
    this.props.messengerList.listen();

    // load notifications
    try {
      await this.props.notifications.readLocal();
    } finally {
      this.props.notifications.loadList(true);
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.props.messengerList.unlisten();
    if (this.contentSizeChangeTimeout) {
      clearTimeout(this.contentSizeChangeTimeout);
    }
    if (this.disposeTabPress) {
      this.disposeTabPress();
    }
  }

  refreshPortrait = () => {
    if (this.portraitBar.current) {
      this.portraitBar.current.load();
    }
  };

  onContentSizeChange = () => {
    if (this.props.newsfeed.feedStore.didPrepend) {
      const listRef = this.props.newsfeed.listRef?.listRef;
      this.contentSizeChangeTimeout = setTimeout(() => {
        if (listRef && listRef.scrollToOffset) {
          const {
            scrollOffset,
            lastActivityPrepended,
          } = this.props.newsfeed.feedStore;
          listRef.scrollToOffset({
            offset: scrollOffset + lastActivityPrepended,
            animated: true,
          });
        }
        this.props.newsfeed.feedStore.lastActivityPrepended = 0;
        this.props.newsfeed.feedStore.didPrepend = false;
      }, 1000);
    }
  };

  /**
   * Render
   */
  render() {
    const newsfeed = this.props.newsfeed;

    const header = (
      <View>
        <CheckLanguage />
        <PortraitContentBar ref={this.portraitBar} />
      </View>
    );

    // Show placeholder before the loading as an empty component.
    const additionalProps = newsfeed.feedStore.loaded
      ? {}
      : {
          ListEmptyComponent: (
            <View>
              <ActivityPlaceHolder />
              <ActivityPlaceHolder />
            </View>
          ),
        };

    return (
      <FeedList
        ref={newsfeed.setListRef}
        header={header}
        feedStore={newsfeed.feedStore}
        navigation={this.props.navigation}
        onRefresh={this.refreshPortrait}
        onContentSizeChange={this.onContentSizeChange}
        {...additionalProps}
      />
    );
  }
}

export default NewsfeedScreen;
