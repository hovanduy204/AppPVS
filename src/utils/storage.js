import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
};

export const storage = {
  // User
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Login status
  async setLoggedIn(status) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(status));
    } catch (error) {
      console.error('Error setting login status:', error);
    }
  },

  async isLoggedIn() {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Error getting login status:', error);
      return false;
    }
  },
};

