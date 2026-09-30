/**
 * =====================================================
 * EXPERIMENT 5: Form Validation
 * File: Exp5_FormValidation/GigFormUI.js
 * Purpose: Form UI for gig creation
 * Concepts: Form state, controlled components
 * Depends on: Exp1_BasicUI, Exp8_NativeFeatures
 * =====================================================
 */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppInput } from '../Exp1_BasicUI/AppInput';
import { AppButton } from '../Exp1_BasicUI/AppButton';
import { AppText } from '../Exp1_BasicUI/AppText';
import { ImagePickerField } from '../Exp8_NativeFeatures/ImagePickerField';
import { theme } from '../shared/theme';

export const GigFormUI = ({ form, loading, imageUri, onChangeImage }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText variant="title" style={{ marginBottom: 16 }}>Post a Gig</AppText>
      
      <ImagePickerField imageUri={imageUri} onChangeImage={onChangeImage} />

      <AppInput 
        label="Title" 
        value={form.values.title} 
        onChangeText={form.handleChange('title')} 
        onBlur={form.handleBlur('title')}
        error={form.touched.title && form.errors.title} 
      />
      <AppInput 
        label="Description" 
        value={form.values.description} 
        onChangeText={form.handleChange('description')} 
        onBlur={form.handleBlur('description')}
        error={form.touched.description && form.errors.description}
        multiline
        numberOfLines={3}
      />
      <AppInput 
        label="Category" 
        value={form.values.category} 
        onChangeText={form.handleChange('category')} 
        onBlur={form.handleBlur('category')}
        error={form.touched.category && form.errors.category} 
      />
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <AppInput 
            label="Price ($)" 
            value={form.values.price} 
            onChangeText={form.handleChange('price')} 
            onBlur={form.handleBlur('price')}
            error={form.touched.price && form.errors.price}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppInput 
            label="Duration (mins)" 
            value={form.values.durationMinutes} 
            onChangeText={form.handleChange('durationMinutes')} 
            onBlur={form.handleBlur('durationMinutes')}
            error={form.touched.durationMinutes && form.errors.durationMinutes}
            keyboardType="numeric"
          />
        </View>
      </View>
      <AppInput 
        label="Location" 
        value={form.values.location} 
        onChangeText={form.handleChange('location')} 
        onBlur={form.handleBlur('location')}
        error={form.touched.location && form.errors.location} 
      />
      <AppInput 
        label="Availability" 
        value={form.values.availability} 
        onChangeText={form.handleChange('availability')} 
        onBlur={form.handleBlur('availability')}
        error={form.touched.availability && form.errors.availability} 
      />

      <AppButton 
        title="Post Gig" 
        onPress={form.handleSubmit} 
        loading={loading}
        disabled={!form.isValid}
        style={{ marginTop: 24, marginBottom: 40 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.m },
  row: { flexDirection: 'row' }
});
