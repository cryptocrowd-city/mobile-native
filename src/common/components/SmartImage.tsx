import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  Image,
  ImageURISource,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';
import ProgressCircle from 'react-native-progress/CircleSnail';
import Animated from 'react-native-reanimated';
import { mix, useTimingTransition } from 'react-native-redash';
import Icon from 'react-native-vector-icons/Ionicons';
import settingsStore from '../../settings/SettingsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import connectivityService from '../services/connectivity.service';
import RetryableImage from './RetryableImage';

interface SmartImageProps {
  thumbnail?: ImageURISource;
  ignoreDataSaver?: boolean;
  onError?: (e: any) => void;
  size?: number;
  style?: any;
  source: ImageURISource;
  onLoadEnd?: Function;
  resizeMode?: ResizeMode;
  withoutDownloadButton?: boolean;
  imageVisible?: boolean;
  thumbBlurRadius?: number;
}

const defaultBlur = Platform.select({ android: 1, ios: 4 });

/**
 * Fast-image wrapper with retry and connectivity awareness
 * @param {Object} props
 */
export default observer(function (props: SmartImageProps) {
  const { ignoreDataSaver, withoutDownloadButton, ...otherProps } = props;

  const theme = ThemedStyles.style;
  const dataSaverEnabled = settingsStore.dataSaverEnabled;

  const store = useLocalStore(() => ({
    error: false,
    retries: 0,
    progress: undefined,
    imageVisible: ignoreDataSaver ? true : !dataSaverEnabled,
    showOverlay: ignoreDataSaver ? false : dataSaverEnabled,
    showImage(show: boolean = true) {
      store.imageVisible = show;
      store.showOverlay = !show;
    },
    setError(error) {
      store.error = true;
      store.progress = undefined;

      if (props.onError) {
        props.onError(error);
      }
    },
    onLoadEnd() {
      store.showOverlay = false;
      store.progress = undefined;
      store.retries = 0;

      if (props.onLoadEnd) {
        props.onLoadEnd();
      }
    },
    onProgress(e) {
      const p = e.nativeEvent.loaded / e.nativeEvent.total;
      if (p) {
        // @ts-ignore
        store.progress = p;
      }
    },
    onDownload() {
      store.imageVisible = true;
      if (store.progress === undefined) {
        // @ts-ignore
        store.progress = 0;
      }
    },
    clearError() {
      store.error = false;
    },
    retry() {
      store.error = false;
      store.retries++;
    },
    async showImageIfCacheExists() {
      if (!props.source.uri) {
        return;
      }
      //@ts-ignore
      const cached = await FastImage.getCachePath({
        uri: props.source.uri,
      });

      if (!cached) {
        return;
      }

      this.showImage();
    },
  }));

  useEffect(() => {
    if (props.imageVisible) {
      store.showImage(props.imageVisible);
    }
  }, [props.imageVisible, store]);

  useEffect(() => {
    try {
      store.showImageIfCacheExists();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showOverlayTransition = useTimingTransition(store.showOverlay, {
    duration: 150,
  });
  const opacity = mix(showOverlayTransition, 0, 1);

  useEffect(
    () =>
      autorun(() => {
        if (connectivityService.isConnected && store.error) {
          store.retry();
        }

        if (store.showOverlay && !settingsStore.dataSaverEnabled) {
          store.showImage();
        }
      }),
    [store],
  );

  if (store.error) {
    return (
      <View style={[props.style, ThemedStyles.style.centered]}>
        <Icon
          name="wifi-off"
          size={props.size || 24}
          style={ThemedStyles.style.colorTertiaryText}
        />
      </View>
    );
  }

  const imageOverlay = (
    <Animated.View
      pointerEvents={store.showOverlay ? undefined : 'none'}
      style={[
        theme.positionAbsolute,
        theme.centered,
        {
          opacity,
        },
      ]}>
      {!withoutDownloadButton && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={store.progress === undefined ? store.onDownload : undefined}
          style={[theme.positionAbsolute, theme.centered]}>
          <View style={[styles.downloadButton, theme.centered]}>
            {typeof store.progress === 'number' ? (
              <ProgressCircle
                progress={store.progress}
                color="white"
                indeterminate={store.imageVisible && store.progress === 0}
              />
            ) : (
              <Icon name="arrow-down" style={theme.colorWhite} size={30} />
            )}
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={props.style}>
      {store.imageVisible && (
        <RetryableImage
          {...otherProps}
          retry={2}
          key={store.retries}
          onError={store.setError}
          source={props.source}
          onLoadEnd={store.onLoadEnd}
          onProgress={store.onProgress}
        />
      )}
      {
        /**
         * Thumbnail
         * */
        store.showOverlay && props.thumbnail && (
          <Image
            key={`thumbnail:${store.retries}`}
            blurRadius={props.thumbBlurRadius || defaultBlur}
            style={props.style}
            source={props.thumbnail}
          />
        )
      }
      {dataSaverEnabled && imageOverlay}
    </View>
  );
});

const styles = StyleSheet.create({
  downloadButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    width: 50,
    height: 50,
  },
});