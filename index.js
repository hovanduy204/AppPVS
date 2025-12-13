import { registerRootComponent } from 'expo';

// Try to enable screens, but don't fail if it doesn't work
try {
  const { enableScreens } = require('react-native-screens');
  enableScreens();
} catch (e) {
  console.warn('Could not enable screens:', e);
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
