/**
 * =====================================================
 * EXPERIMENT 10: Local Storage Integration
 * File: Exp10_LocalStorage/storage.js
 * Purpose: AsyncStorage wrapper
 * Concepts: Persistence
 * =====================================================
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
const PREFIX = '@skillswap:';

export const storage = {
  set: async (key, value) => {
    try { await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)); } 
    catch (e) { console.error('Storage set error', e); }
  },
  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(PREFIX + key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Storage get error', e); return null;
    }
  },
  remove: async (key) => {
    try { await AsyncStorage.removeItem(PREFIX + key); } 
    catch (e) { console.error('Storage remove error', e); }
  },
  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(k => k.startsWith(PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (e) { console.error('Storage clear error', e); }
  }
};
