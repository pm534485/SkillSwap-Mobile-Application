/**
 * =====================================================
 * EXPERIMENT 2: Flexbox and Responsive Layouts
 * File: Exp2_FlexboxLayouts/GigGrid.js
 * Purpose: Grid wrapper for gig cards
 * Concepts: Flexbox row and wrap
 * =====================================================
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../shared/theme';

export const GigGrid = ({ children, columns }) => {
  return (
    <View style={styles.container}>
      {React.Children.map(children, child => (
        <View style={{ width: \`\${100 / columns}%\`, padding: theme.spacing.xs }}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  }
});
