/**
 * =====================================================
 * EXPERIMENT 10: Local Storage Integration
 * File: Exp10_LocalStorage/useNetworkStatus.js
 * Purpose: Network status hook
 * Concepts: NetInfo
 * =====================================================
 */
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(state.isConnected === false);
    });
    return unsubscribe;
  }, []);
  return isOffline;
};\n