/**
 * =====================================================
 * EXPERIMENT 3: Navigation
 * File: screens/GigDetailScreen.js
 * Purpose: View gig details
 * Concepts: Route params
 * Depends on: Exp6_ApiNetworking, Exp9_AnimationsGestures
 * =====================================================
 */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AnimatedButton } from '../Exp9_AnimationsGestures/AnimatedButton';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';
import { useAuth } from '../Exp4_GlobalState/AuthContext';
import { theme } from '../shared/theme';

export const GigDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await apiClient.get(\`/api/gigs/\${id}\`);
        if (res.success) setGig(res.data);
      } catch (e) {
        Alert.alert('Error', 'Could not load gig details');
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleBook = () => {
    if (gig.owner._id === user._id) {
      Alert.alert('Oops', 'You cannot book your own gig');
      return;
    }
    navigation.navigate('BookingConfirm', { gig });
  };

  if (loading || !gig) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: gig.thumbnailUrl || 'https://via.placeholder.com/400x200' }} style={styles.image} />
      <View style={styles.content}>
        <AppText variant="title">{gig.title}</AppText>
        <AppText style={styles.price}>$\{(gig.price || 0).toFixed(2)}</AppText>
        <AppText style={{ marginVertical: 8 }}>{gig.description}</AppText>
        <AppText variant="caption">Category: {gig.category}</AppText>
        <AppText variant="caption">Duration: {gig.durationMinutes} mins</AppText>
        <AppText variant="caption">Location: {gig.location}</AppText>
        
        <View style={styles.ownerBox}>
          <AppText variant="subtitle">Offered by {gig.owner.name}</AppText>
          <AppText variant="caption">Rating: {gig.owner.rating}</AppText>
        </View>

        <AnimatedButton 
          title="Book Now" 
          onPress={handleBook} 
          style={{ marginTop: 20 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: theme.colors.background },
  image: { width: '100%', height: 250, backgroundColor: theme.colors.surface },
  content: { padding: theme.spacing.xl },
  price: { color: theme.colors.success, fontWeight: 'bold', fontSize: 20, marginVertical: 4 },
  ownerBox: { marginTop: 20, padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8 }
});
