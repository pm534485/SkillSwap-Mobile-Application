/**
 * =====================================================
 * EXPERIMENT 9: Animations and Gestures
 * File: Exp9_AnimationsGestures/SwipeableBookingCard.js
 * Purpose: Swipe-to-cancel card
 * Concepts: PanGestureHandler, Reanimated
 * =====================================================
 */
import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withTiming } from 'react-native-reanimated';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AppButton } from '../Exp1_BasicUI/AppButton';
import { theme } from '../shared/theme';

export const SwipeableBookingCard = ({ booking, onCancel }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const itemHeight = useSharedValue(100);

  const confirmCancel = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to cancel this booking?')) {
        opacity.value = withTiming(0, { duration: 300 });
        itemHeight.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onCancel)(booking._id);
        });
      } else {
        translateX.value = withSpring(0);
      }
    } else {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          { text: 'No', onPress: () => { translateX.value = withSpring(0); }, style: 'cancel' },
          { text: 'Yes', onPress: () => {
              opacity.value = withTiming(0, { duration: 300 });
              itemHeight.value = withTiming(0, { duration: 300 }, () => {
                runOnJS(onCancel)(booking._id);
              });
            }, style: 'destructive' }
        ]
      );
    }
  };

  const gestureHandler = (event) => {
    'worklet';
    // Dummy handler for web if actual gesture fails
  };

  const onGestureEvent = (event) => {
    const trans = Math.min(Math.max(event.nativeEvent.translationX, -150), 0);
    translateX.value = trans;
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5 || event.nativeEvent.state === 4) {
      if (translateX.value < -80) {
        translateX.value = withSpring(-100);
        runOnJS(confirmCancel)();
      } else {
        translateX.value = withSpring(0);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: itemHeight.value > 100 ? 100 : itemHeight.value,
    marginBottom: itemHeight.value === 0 ? 0 : theme.spacing.s,
    overflow: 'hidden'
  }));

  const showFallback = Platform.OS === 'web';

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <View style={styles.actionBackground}>
        <AppText style={styles.actionText}>Cancel</AppText>
      </View>
      <PanGestureHandler activeOffsetX={[-10, 10]} onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={{ flex: 1 }}>
            <AppText variant="subtitle">{booking.gig?.title || 'Unknown Gig'}</AppText>
            <AppText style={styles.status}>Status: {booking.status}</AppText>
            <AppText variant="caption">With: {booking.seller?.name || booking.buyer?.name}</AppText>
          </View>
          {showFallback && booking.status !== 'cancelled' && (
            <AppButton title="Cancel" onPress={confirmCancel} style={{ padding: 8, backgroundColor: theme.colors.error }} />
          )}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.error,
    borderRadius: 8,
  },
  actionBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: theme.spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center'
  },
  status: {
    marginTop: 4,
    color: theme.colors.primary,
    fontWeight: '500'
  }
});
