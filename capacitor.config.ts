
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b273ec913e846c782d7d479d19f4fcb',
  appName: 'WellnessHub',
  webDir: 'dist',
  server: {
    url: 'https://5b273ec9-13e8-46c7-82d7-d479d19f4fcb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
