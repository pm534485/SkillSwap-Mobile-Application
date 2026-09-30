/**
 * =====================================================
 * EXPERIMENT 2: Flexbox and Responsive Layouts
 * File: Exp2_FlexboxLayouts/GigCard.js
 * Purpose: A responsive gig item component
 * Concepts: Flexbox, Styling
 * Depends on: Exp1_BasicUI
 * =====================================================
 */
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { theme } from '../shared/theme';

export const GigCard = ({ gig, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <Image 
        source={{ uri: gig.thumbnailUrl || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <View style={styles.chip}><AppText style={styles.chipText}>{gig.category}</AppText></View>
        <AppText variant="subtitle" style={styles.title} numberOfLines={1}>{gig.title}</AppText>
        <View style={styles.footer}>
          <AppText style={styles.price}>$\{(gig.price || 0).toFixed(2)}</AppText>
          <AppText style={styles.rating}>★ {gig.ratingAvg > 0 ? gig.ratingAvg.toFixed(1) : 'New'}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: theme.spacing.s,
  },
  title: {
    marginVertical: 4,
    fontSize: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  rating: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  }
});
