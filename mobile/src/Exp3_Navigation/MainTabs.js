/**
 * =====================================================
 * EXPERIMENT 3: Navigation
 * File: Exp3_Navigation/MainTabs.js
 * Purpose: Bottom tabs setup
 * Concepts: BottomTabNavigator
 * =====================================================
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from './navigationConstants';
import { HomeScreen, ExploreScreen, PostGigScreen, MyBookingsScreen, ProfileScreen } from '../screens/stubs';
import { useBookingCart } from '../Exp4_GlobalState/BookingCartContext';
import { theme } from '../shared/theme';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const { count } = useBookingCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse';
          if (route.name === ROUTES.HOME) iconName = focused ? 'home' : 'home-outline';
          if (route.name === ROUTES.EXPLORE) iconName = focused ? 'search' : 'search-outline';
          if (route.name === ROUTES.POST_GIG) iconName = focused ? 'add-circle' : 'add-circle-outline';
          if (route.name === ROUTES.MY_BOOKINGS) iconName = focused ? 'calendar' : 'calendar-outline';
          if (route.name === ROUTES.PROFILE) iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.EXPLORE} component={ExploreScreen} />
      <Tab.Screen name={ROUTES.POST_GIG} component={PostGigScreen} />
      <Tab.Screen name={ROUTES.MY_BOOKINGS} component={MyBookingsScreen} options={{ tabBarBadge: count > 0 ? count : null }} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};
