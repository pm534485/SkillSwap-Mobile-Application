import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/Exp4_GlobalState/AuthContext';
import { BookingCartProvider } from './src/Exp4_GlobalState/BookingCartContext';
import { RootNavigator } from './src/Exp3_Navigation/RootNavigator';
import { WebPhoneFrame } from './src/shared/WebPhoneFrame';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorBoundary } from './src/Exp12_Optimization/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <WebPhoneFrame>
            <AuthProvider>
              <BookingCartProvider>
                <RootNavigator />
                <StatusBar style="auto" />
              </BookingCartProvider>
            </AuthProvider>
          </WebPhoneFrame>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
