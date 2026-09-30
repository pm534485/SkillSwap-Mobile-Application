/**
 * =====================================================
 * EXPERIMENT 9: Animations and Gestures
 * File: Exp9_AnimationsGestures/AnimatedButton.js
 * Purpose: Button with scale animation on press
 * Concepts: Reanimated, GestureHandler
 * =====================================================
 */
import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { theme } from '../shared/theme';

export const AnimatedButton = ({ title, onPress, loading, disabled, style }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const onStateChange = (event) => {
    if (disabled || loading) return;
    if (event.nativeEvent.state === 2) { // BEGAN
      scale.value = withSpring(0.95);
    } else if (event.nativeEvent.state === 4 || event.nativeEvent.state === 5) { // END or FAILED/CANCELLED
      scale.value = withSpring(1);
      if (event.nativeEvent.state === 4) {
        runOnJS(onPress)();
      }
    }
  };

  return (
    <TapGestureHandler onHandlerStateChange={onStateChange}>
      <Animated.View style={[styles.button, disabled && styles.disabled, animatedStyle, style]}>
        {loading ? <ActivityIndicator color="#fff" /> : <Animated.Text style={styles.text}>{title}</Animated.Text>}
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.6 },
  text: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
