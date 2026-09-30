/**
 * =====================================================
 * EXPERIMENT 3: Navigation
 * File: screens/HomeScreen.js
 * Purpose: Home Dashboard
 * Concepts: Layouts, Animations
 * Depends on: Exp2_FlexboxLayouts, Exp9_AnimationsGestures, Exp6_ApiNetworking, Exp10_LocalStorage
 * =====================================================
 */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { GigGrid } from '../Exp2_FlexboxLayouts/GigGrid';
import { GigCard } from '../Exp2_FlexboxLayouts/GigCard';
import { useResponsiveColumns } from '../Exp2_FlexboxLayouts/useResponsiveColumns';
import { FadeInView } from '../Exp9_AnimationsGestures/FadeInView';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';
import { storage } from '../Exp10_LocalStorage/storage';
import { useAuth } from '../Exp4_GlobalState/AuthContext';
import { theme } from '../shared/theme';

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const columns = useResponsiveColumns();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGigs = async () => {
    try {
      const cached = await storage.get('home_gigs');
      if (cached) setGigs(cached);
      const res = await apiClient.get('/api/gigs?limit=6');
      if (res.success) {
        setGigs(res.data);
        await storage.set('home_gigs', res.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadGigs(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadGigs();
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <FadeInView delay={0}>
        <AppText variant="title" style={styles.greeting}>Hello, {user?.name.split(' ')[0]} 👋</AppText>
        <AppText style={styles.subtitle}>Find help for your next project</AppText>
      </FadeInView>

      <FadeInView delay={200} style={styles.section}>
        <AppText variant="subtitle" style={styles.sectionTitle}>Featured Gigs</AppText>
        {loading && gigs.length === 0 ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <GigGrid columns={columns}>
            {gigs.map((gig, idx) => (
              <GigCard 
                key={gig._id} 
                gig={gig} 
                onPress={() => navigation.navigate('GigDetail', { id: gig._id })} 
              />
            ))}
          </GigGrid>
        )}
      </FadeInView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.m },
  greeting: { marginTop: 40, color: theme.colors.primary },
  subtitle: { marginBottom: 24, color: theme.colors.textSecondary },
  section: { marginTop: 16 },
  sectionTitle: { marginBottom: 16 }
});
