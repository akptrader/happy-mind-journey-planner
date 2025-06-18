
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.happymindjourney',
  appName: 'happy-mind-journey-planner',
  webDir: 'dist',
  bundledWebRuntime: false,
  ios: {
    scheme: 'happy-mind-journey-planner'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
  packageClassList: [
    "LocalNotificationsPlugin",
    "PushNotificationsPlugin"
  ]
};

export default config;
