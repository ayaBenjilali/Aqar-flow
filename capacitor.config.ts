import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aqarflow.app',
  appName: 'AqarFlow',
  webDir: 'dist/aqarflow/browser',
  bundledWebRuntime: false,
  backgroundColor: '#f2f5f1',
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: '#0b6f68',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#f2f5f1',
      overlaysWebView: false
    }
  }
};

export default config;
