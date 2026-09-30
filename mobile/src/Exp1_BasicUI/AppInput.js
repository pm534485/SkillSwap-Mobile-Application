/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/AppInput.js
 * Purpose: Primitive input component
 * Concepts: TextInput, UI state
 * =====================================================
 */
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../shared/theme';

export const AppInput = ({ label, error, secureTextEntry, ...props }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.errorContainer]}>
        <TextInput 
          style={styles.input} 
          secureTextEntry={isSecure} 
          placeholderTextColor={theme.colors.textSecondary}
          {...props} 
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.toggle}>
            <Text style={styles.toggleText}>{isSecure ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: theme.spacing.s },
  label: { marginBottom: 4, fontWeight: '500', color: theme.colors.text },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    alignItems: 'center'
  },
  errorContainer: { borderColor: theme.colors.error },
  input: { flex: 1, padding: theme.spacing.m, color: theme.colors.text },
  toggle: { paddingHorizontal: 10 },
  toggleText: { color: theme.colors.primary, fontWeight: '500' },
  errorText: { color: theme.colors.error, fontSize: 12, marginTop: 4 }
});\n