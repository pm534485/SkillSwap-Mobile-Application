/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/LoginScreenUI.js
 * Purpose: Pure UI for login
 * Concepts: KeyboardAvoidingView, ScrollView
 * =====================================================
 */
import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { theme } from '../shared/theme';

export const LoginScreenUI = ({ form, onNavigateRegister, loading }) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="title" style={styles.title}>SkillSwap</AppText>
        <AppText variant="subtitle" style={styles.subtitle}>Welcome back!</AppText>
        
        <AppInput 
          label="Email" 
          value={form.values.email} 
          onChangeText={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
          error={form.touched.email && form.errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput 
          label="Password" 
          value={form.values.password} 
          onChangeText={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
          error={form.touched.password && form.errors.password}
          secureTextEntry
        />
        
        <AppButton 
          title="Login" 
          onPress={form.handleSubmit} 
          loading={loading}
          disabled={!form.isValid}
          style={{ marginTop: 24 }}
        />
        <AppButton 
          title="Create an account" 
          onPress={onNavigateRegister} 
          style={styles.linkButton} 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.xl, flexGrow: 1, justifyContent: 'center' },
  title: { textAlign: 'center', color: theme.colors.primary, marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 32 },
  linkButton: { backgroundColor: 'transparent', marginTop: 8 }
});\n