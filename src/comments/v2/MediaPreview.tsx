import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';

import type AttachmentStore from '../../common/stores/AttachmentStore';
import MindsVideo from '../../media/v2/mindsVideo/MindsVideo';
import ThemedStyles from '../../styles/ThemedStyles';

const width = Dimensions.get('window').width * 0.8;

/**
 * Media preview
 */
export default observer(function MediaPreview({
  attachment,
}: {
  attachment: AttachmentStore;
}) {
  if (!attachment.hasAttachment) return null;
  const theme = ThemedStyles.style;

  const src = {
    uri: toJS(attachment.uri),
  };

  const aspect = {
    aspectRatio:
      attachment.height && attachment.width
        ? attachment.width / attachment.height
        : 1,
  };

  let body: React.ReactNode | null = null;
  switch (attachment.type) {
    case 'image/gif':
    case 'image/jpeg':
    case 'image':
    default:
      body = (
        <FastImage
          resizeMode="cover"
          source={src}
          style={[styles.preview, aspect]}
        />
      );
      break;
    case 'video/mp4':
    case 'video/quicktime':
    case 'video/x-m4v':
    case 'video':
      const MindsVideoComponent = <MindsVideo video={src} />;

      body = (
        <View style={[styles.preview, aspect]}>{MindsVideoComponent}</View>
      );
      break;
  }

  return (
    <View style={[styles.wrapper, aspect]} pointerEvents="box-none">
      {body}
      <Icon
        name="close-circle-sharp"
        size={32}
        style={[theme.colorWhite, styles.close]}
        onPress={() => attachment.delete(true)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    top: -15,
    right: -15,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginHorizontal: 20,
    marginBottom: 15,
    maxHeight: 150,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 16,
  },
  preview: {
    flex: 1,
    width,
    maxHeight: 150,
    borderRadius: 15,
  },
});