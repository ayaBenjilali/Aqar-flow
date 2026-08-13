import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.portfolio.aqarflow',
  appName: 'AqarFlow',
  webDir: 'dist/aqarflow/browser',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#0f766e',
      showSpinner: false
    }
  }
};

export default config;
