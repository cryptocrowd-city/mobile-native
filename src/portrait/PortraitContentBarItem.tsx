import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import ThemedStyles from '../styles/ThemedStyles';
import excerpt from '../common/helpers/excerpt';
import type { PortraitBarItem } from './createPortraitStore';
import PressableScale from '../common/components/PressableScale';

type PropsType = {
  item: PortraitBarItem;
  onPress: () => void;
};

/**
 * Portrait content bar items
 * @param props Props
 */
export default observer(function PortraitContentBarItem(props: PropsType) {
  const theme = ThemedStyles.style;
  return (
    <View
      style={[
        theme.columnAlignCenter,
        styles.container,
        theme.backgroundTransparent,
        theme.centered,
      ]}>
      <PressableScale onPress={props.onPress} activeOpacity={0.5}>
        <FastImage
          source={props.item.user.getAvatarSource()}
          style={styles.avatar}
        />
        {props.item.unseen ? <View style={styles.unseen} /> : null}
      </PressableScale>
      <Text style={[theme.fontM, styles.text, theme.colorSecondaryText]}>
        {excerpt(props.item.user.username, 10)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    overflow: 'visible',
  },
  text: {
    marginTop: 8,
  },
  unseen: {
    zIndex: 9990,
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2.2,
    borderRadius: 30,
    position: 'absolute',
    borderColor: '#ECDA51',
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 27.5,
  },
});
