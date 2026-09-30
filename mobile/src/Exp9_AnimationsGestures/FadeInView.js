/**
 * =====================================================
 * EXPERIMENT 9: Animations and Gestures
 * File: Exp9_AnimationsGestures/FadeInView.js
 * Purpose: Fade in wrapper
 * Concepts: Reanimated
 * =====================================================
 */
import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated';

export const FadeInView = ({ children, delay = 0, style }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
