/**
 * =====================================================
 * EXPERIMENT 3: Navigation
 * File: screens/BookingConfirmScreen.js
 * Purpose: Confirm booking
 * Concepts: Route params, API calls
 * =====================================================
 */
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AnimatedButton } from '../Exp9_AnimationsGestures/AnimatedButton';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';
import { theme } from '../shared/theme';

export const BookingConfirmScreen = ({ route, navigation }) => {
  const { gig } = route.params;
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        gig: gig._id,
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
        notes: 'Booking from confirm screen'
      };
      const res = await apiClient.post('/api/bookings', payload);
      if (res.success) {
        Alert.alert('Success', 'Gig booked! Check My Bookings.');
        navigation.navigate('MyBookings');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="title">Confirm Booking</AppText>
      <View style={styles.card}>
        <AppText variant="subtitle">{gig.title}</AppText>
        <AppText style={styles.price}>$\{(gig.price || 0).toFixed(2)}</AppText>
        <AppText style={{ marginVertical: 8 }}>{gig.description}</AppText>
      </View>
      
      <AnimatedButton 
        title="Confirm Booking" 
        onPress={confirmBooking} 
        loading={loading}
        style={{ marginTop: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.xl },
  card: { padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8, marginTop: 20 },
  price: { color: theme.colors.success, fontWeight: 'bold', fontSize: 18, marginTop: 4 }
});
