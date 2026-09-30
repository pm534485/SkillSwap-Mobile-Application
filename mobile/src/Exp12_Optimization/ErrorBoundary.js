/**
 * =====================================================
 * EXPERIMENT 12: App Optimization and Final Build Prep
 * File: Exp12_Optimization/ErrorBoundary.js
 * Purpose: Catch unhandled errors gracefully
 * Concepts: Error Boundaries
 * =====================================================
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AppButton } from '../Exp1_BasicUI/AppButton';
import { theme } from '../shared/theme';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <AppText variant="title">Something went wrong.</AppText>
          <AppText style={styles.errorText}>{this.state.error?.message}</AppText>
          <AppButton title="Try Again" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  errorText: { color: theme.colors.error, marginVertical: 20, textAlign: 'center' }
});
