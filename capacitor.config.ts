import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": 'com.easyreserve.test',
  "appName": 'TheBarberApp',
  "webDir": 'www',
  "bundledWebRuntime": false,
  "plugins": {
      "PushNotifications": {
        "presentationOptions": [
          "badge",
          "sound",
          "alert"
        ]
      } ,
      // "GoogleAuth": {
      //   "scopes": ["profile", "email"],
      //   "serverClientId": "266915288245-ca0r830cdlc2q4b768e67k73bsjnrhl9.apps.googleusercontent.com",
      // }
    }
};

export default config;
