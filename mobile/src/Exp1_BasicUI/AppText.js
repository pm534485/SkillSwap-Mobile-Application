/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/AppText.js
 * Purpose: Primitive text component
 * Concepts: StyleSheet, Text
 * =====================================================
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../shared/theme';

export const AppText = ({ children, style, variant = 'body', ...props }) => {
  return <Text style={[styles[variant], style]} {...props}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text },
  subtitle: { ...theme.typography.subtitle, color: theme.colors.text },
  body: { ...theme.typography.body, color: theme.colors.text },
  caption: { ...theme.typography.caption }
});\n