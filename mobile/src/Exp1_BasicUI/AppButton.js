/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/AppButton.js
 * Purpose: Primitive button component
 * Concepts: TouchableOpacity, Pressable
 * =====================================================
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../shared/theme';

export const AppButton = ({ title, onPress, disabled, loading, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled, style]} 
      onPress={onPress} 
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.s,
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
