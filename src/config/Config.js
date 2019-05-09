import {
  Platform
} from 'react-native';

// export const MINDS_URI = 'https://www.minds.com/';
// export const MINDS_URI = 'http://dev.minds.io/';

// remember to update deeplink uri on AndroidManifest.xml !!!
// export const MINDS_URI = 'http://172.16.2.61:8080/';
export const MINDS_URI = 'https://www.minds.com/';
export const MINDS_API_URI = 'https://www.minds.com/';

export const MINDS_URI_SETTINGS = {
  //basicAuth: 'crypto:ohms',
};

export const MINDS_MAX_VIDEO_LENGTH = 5; // in minutes

export const SOCKET_URI = 'wss://ha-socket-io-us-east-1.minds.com:3030'

export const MINDS_CDN_URI = 'https://cdn.minds.com/';
export const MINDS_ASSETS_CDN_URI = 'https://cdn-assets.minds.com/';
// export const MINDS_CDN_URI = 'http://dev.minds.io/';

export const BLOCKCHAIN_URI = 'https://www.minds.com/api/v2/blockchain/proxy/';
// export const BLOCKCHAIN_URI = 'http://localhost:9545';
export const MINDS_LINK_URI = 'https://www.minds.com/';
export const CODE_PUSH_TOKEN = '';

/**
 * Plataform dependant or fixed features
 */
export const MINDS_FEATURES = {
  crypto: Platform.OS === 'ios' ? false : true,
};

/**
 * Deeplink to screen/params maping
 */
export const MINDS_DEEPLINK = [
  ['groups/profile/:guid/feed', 'GroupView'],
  ['groups/profile/:guid', 'GroupView'],
  ['notifications', 'Notifications'],
  ['groups/:filter', 'GroupsList'],
  ['newsfeed/:guid', 'Activity'],
  ['media/:guid', 'Activity'],
  ['channels/:username', 'Channel'],
  ['blog/:filter', 'BlogList'],
  ['blog/view/:guid', 'BlogView'],
  [':user/blog/:slug', 'BlogView'],
  [':username', 'Channel'],
  ['wallet/tokens/:section', 'Wallet'],
];


export const GOOGLE_PLAY_STORE = true;
