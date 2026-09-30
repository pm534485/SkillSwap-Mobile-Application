/**
 * =====================================================
 * EXPERIMENT 3: Navigation
 * File: screens/PostGigScreen.js
 * Purpose: Post gig composition
 * Concepts: Form wiring, API integration
 * Depends on: Exp5_FormValidation, Exp6_ApiNetworking
 * =====================================================
 */
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { GigFormUI } from '../Exp5_FormValidation/GigFormUI';
import { useForm } from '../Exp5_FormValidation/useForm';
import { validateGig } from '../Exp5_FormValidation/validators';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';

export const PostGigScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const form = useForm({
    title: '', description: '', category: '', price: '', durationMinutes: '', location: '', availability: ''
  }, validateGig, async (values) => {
    setLoading(true);
    try {
      let uploadedUrl = null;
      if (imageUri) {
        // Build FormData
        const formData = new FormData();
        // Handle web blob vs native uri
        if (imageUri.startsWith('data:') || imageUri.startsWith('blob:')) {
            const res = await fetch(imageUri);
            const blob = await res.blob();
            formData.append('image', blob, 'upload.jpg');
        } else {
            formData.append('image', { uri: imageUri, name: 'upload.jpg', type: 'image/jpeg' });
        }
        const uploadRes = await apiClient.postFormData('/api/upload', formData);
        uploadedUrl = uploadRes.data;
      }

      const payload = {
        ...values,
        price: Number(values.price),
        durationMinutes: Number(values.durationMinutes),
        thumbnailUrl: uploadedUrl
      };

      await apiClient.post('/api/gigs', payload);
      Alert.alert('Success', 'Gig posted successfully!');
      form.reset();
      setImageUri(null);
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <GigFormUI 
      form={form} 
      loading={loading} 
      imageUri={imageUri}
      onChangeImage={setImageUri}
    />
  );
};
