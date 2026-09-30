/**
 * =====================================================
 * EXPERIMENT 8: Native Device Features
 * File: Exp8_NativeFeatures/ImagePickerField.js
 * Purpose: Image Picker with web fallback
 * Concepts: Expo ImagePicker, Platform differences
 * =====================================================
 */
import React, { useState } from 'react';
import { View, Image, StyleSheet, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AppButton } from '../Exp1_BasicUI/AppButton';
import { theme } from '../shared/theme';

export const ImagePickerField = ({ imageUri, onChangeImage }) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (e) {
      if (Platform.OS !== 'web') {
        Alert.alert('Error picking image', e.message);
      } else {
        console.error(e);
      }
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        if (Platform.OS !== 'web') {
          Alert.alert('Permission needed', 'Camera permission is required.');
        } else {
          alert('Camera permission is required.');
        }
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera failed, falling back to library on web or specific emulator:', e.message);
      pickImage();
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <AppButton title="Change Photo" onPress={pickImage} style={styles.btn} />
          <AppButton title="Remove Photo" onPress={() => onChangeImage(null)} style={[styles.btn, styles.removeBtn]} />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <AppText style={{ marginBottom: 10 }}>No photo selected</AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <AppButton title="Pick from Library" onPress={pickImage} style={[styles.btn, { marginRight: 8 }]} />
            <AppButton title="Take Photo" onPress={takePhoto} style={styles.btn} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: theme.spacing.m },
  image: { width: '100%', height: 200, borderRadius: 8, backgroundColor: theme.colors.surface },
  placeholder: { padding: 20, backgroundColor: theme.colors.surface, borderRadius: 8, alignItems: 'center' },
  btn: { paddingVertical: 8, paddingHorizontal: 12, marginTop: 8 },
  removeBtn: { backgroundColor: theme.colors.error }
});
