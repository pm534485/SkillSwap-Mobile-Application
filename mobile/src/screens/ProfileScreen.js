/**
 * =====================================================
 * EXPERIMENT 4: Global State Management
 * File: screens/ProfileScreen.js
 * Purpose: Profile UI
 * Concepts: Auth context, LocalStorage clear
 * Depends on: Exp4_GlobalState, Exp10_LocalStorage
 * =====================================================
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AppButton } from '../Exp1_BasicUI/AppButton';
import { useAuth } from '../Exp4_GlobalState/AuthContext';
import { storage } from '../Exp10_LocalStorage/storage';
import { theme } from '../shared/theme';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleClearCache = async () => {
    await storage.clear();
    alert('Cache cleared!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="title">{user?.name}</AppText>
        <AppText variant="subtitle" style={{ color: theme.colors.textSecondary }}>{user?.email}</AppText>
      </View>
      
      <View style={styles.actions}>
        <AppButton title="Clear Offline Cache" onPress={handleClearCache} style={styles.btnSecondary} />
        <AppButton title="Logout" onPress={logout} style={styles.btnLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.xl },
  header: { alignItems: 'center', marginVertical: 40 },
  actions: { marginTop: 20 },
  btnSecondary: { backgroundColor: theme.colors.surface, marginBottom: 16 },
  btnLogout: { backgroundColor: theme.colors.error }
});
