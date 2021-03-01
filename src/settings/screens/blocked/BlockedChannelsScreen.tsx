import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import FeedList from '../../../common/components/feedlist/FeedList';
import ThemedStyles from '../../../styles/ThemedStyles';
import createBlockedChannelsStore from './createBlockedChannelsStore';
import i18n from '../../../common/services/i18n.service';
import BlockedChannel, { Row } from './BlockedChannel';

const BlockedChannelsScreen = observer((props) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createBlockedChannelsStore);

  const renderRow = useCallback(
    (row: Row) => <BlockedChannel row={row} localStore={localStore} />,
    [localStore],
  );

  const onRefresh = useCallback(() => {
    localStore.loadList(true);
  }, [localStore]);

  useEffect(() => {
    localStore.loadList();
  });

  return (
    <View style={theme.flexContainer}>
      <FeedList
        feedStore={localStore.feedStore}
        renderActivity={renderRow}
        navigation={props.navigation}
        emptyMessage={
          <View style={[theme.centered, theme.marginTop4x]}>
            <Text>{i18n.t('settings.noBlockedChannels')}</Text>
          </View>
        }
        style={[theme.backgroundPrimary, theme.flexContainer]}
        onRefresh={onRefresh}
      />
    </View>
  );
});

export default BlockedChannelsScreen;
