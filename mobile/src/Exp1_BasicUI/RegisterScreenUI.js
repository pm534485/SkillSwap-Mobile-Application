/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/RegisterScreenUI.js
 * Purpose: Pure UI for registration
 * Concepts: KeyboardAvoidingView, ScrollView
 * =====================================================
 */
import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { theme } from '../shared/theme';

export const RegisterScreenUI = ({ form, onNavigateLogin, loading }) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="title" style={styles.title}>Join SkillSwap</AppText>
        
        <AppInput 
          label="Name" 
          value={form.values.name} 
          onChangeText={form.handleChange('name')}
          onBlur={form.handleBlur('name')}
          error={form.touched.name && form.errors.name}
        />
        <AppInput 
          label="Campus Email" 
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
        <AppInput 
          label="Confirm Password" 
          value={form.values.confirmPassword} 
          onChangeText={form.handleChange('confirmPassword')}
          onBlur={form.handleBlur('confirmPassword')}
          error={form.touched.confirmPassword && form.errors.confirmPassword}
          secureTextEntry
        />
        <AppInput 
          label="Skills I offer (comma separated)" 
          value={form.values.skills} 
          onChangeText={form.handleChange('skills')}
          onBlur={form.handleBlur('skills')}
        />
        
        <AppButton 
          title="Sign Up" 
          onPress={form.handleSubmit} 
          loading={loading}
          disabled={!form.isValid}
          style={{ marginTop: 24 }}
        />
        <AppButton 
          title="Already have an account?" 
          onPress={onNavigateLogin} 
          style={styles.linkButton} 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.l, flexGrow: 1, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 24 },
  linkButton: { backgroundColor: 'transparent', marginTop: 8 }
});\n