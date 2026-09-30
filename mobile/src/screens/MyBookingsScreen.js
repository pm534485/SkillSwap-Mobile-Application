/**
 * =====================================================
 * EXPERIMENT 7: Advanced Lists
 * File: screens/MyBookingsScreen.js
 * Purpose: SectionList of bookings
 * Concepts: SectionList
 * Depends on: Exp6_ApiNetworking, Exp9_AnimationsGestures
 * =====================================================
 */
import React, { useState, useEffect } from 'react';
import { View, SectionList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { SwipeableBookingCard } from '../Exp9_AnimationsGestures/SwipeableBookingCard';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';
import { useNetworkStatus } from '../Exp10_LocalStorage/useNetworkStatus';
import { theme } from '../shared/theme';

export const MyBookingsScreen = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOffline = useNetworkStatus();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/bookings/mine');
      if (res.success) {
        const pending = res.data.filter(b => b.status === 'pending');
        const confirmed = res.data.filter(b => b.status === 'confirmed');
        const past = res.data.filter(b => b.status === 'completed' || b.status === 'cancelled');
        
        const newSections = [];
        if (pending.length > 0) newSections.push({ title: 'Pending', data: pending });
        if (confirmed.length > 0) newSections.push({ title: 'Confirmed', data: confirmed });
        if (past.length > 0) newSections.push({ title: 'Past Bookings', data: past });
        
        setSections(newSections);
      }
    } catch (e) {
      console.warn('Error fetching bookings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (isOffline) {
      Alert.alert('Offline', 'Cannot cancel while offline.');
      return;
    }
    try {
      await apiClient.patch(\`/api/bookings/\${id}/cancel\`);
      fetchBookings();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <SwipeableBookingCard booking={item} onCancel={handleCancel} />}
          renderSectionHeader={({ section: { title } }) => (
            <AppText variant="subtitle" style={styles.header}>{title}</AppText>
          )}
          ListEmptyComponent={<AppText style={{ textAlign: 'center', marginTop: 50 }}>No bookings found.</AppText>}
          contentContainerStyle={{ padding: theme.spacing.m }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingVertical: 8, backgroundColor: theme.colors.background, fontWeight: 'bold' }
});
