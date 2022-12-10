import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": 'com.easyreserve.test',
  "appName": 'TheBarberApp',
  "webDir": 'www',
  "bundledWebRuntime": false,
  "plugins": {
    "GoogleAuth": {
      "scopes": ['profile', 'email'],
      "serverClientId": '16956376570-36krp8g9389r04dhjt604mi26ci8jmh4.apps.googleusercontent.com',
      "forceCodeForRefreshToken": true,
    }
  }
};

export default config;
