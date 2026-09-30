/**
 * =====================================================
 * EXPERIMENT 3: Navigation
 * File: Exp3_Navigation/RootNavigator.js
 * Purpose: Main navigation stack
 * Concepts: NativeStack, Auth flow
 * Depends on: Exp4_GlobalState
 * =====================================================
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './navigationConstants';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { MainTabs } from './MainTabs';
import { GigDetailScreen, BookingConfirmScreen } from '../screens/stubs';
import { useAuth } from '../Exp4_GlobalState/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabs} />
            <Stack.Screen name={ROUTES.GIG_DETAIL} component={GigDetailScreen} options={{ headerShown: true, title: 'Details' }} />
            <Stack.Screen name={ROUTES.BOOKING_CONFIRM} component={BookingConfirmScreen} options={{ headerShown: true, title: 'Confirm' }} />
          </>
        ) : (
          <>
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
