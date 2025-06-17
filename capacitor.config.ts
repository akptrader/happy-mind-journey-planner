
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b273ec913e846c782d7d479d19f4fcb',
  appName: 'WellnessHub',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF", 
      sound: "beep.wav",
    },
  },
};

export default config;
