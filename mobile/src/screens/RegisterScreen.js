/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: screens/RegisterScreen.js
 * Purpose: Register composition wrapper
 * Concepts: Form wiring, Auth context
 * Depends on: Exp1_BasicUI, Exp4_GlobalState, Exp5_FormValidation
 * =====================================================
 */
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { RegisterScreenUI } from '../Exp1_BasicUI/RegisterScreenUI';
import { useForm } from '../Exp5_FormValidation/useForm';
import { validateRegister } from '../Exp5_FormValidation/validators';
import { useAuth } from '../Exp4_GlobalState/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({ name: '', email: '', password: '', confirmPassword: '', skills: '' }, validateRegister, async (values) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password, values.skills.split(',').map(s=>s.trim()));
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <RegisterScreenUI 
      form={form} 
      loading={loading} 
      onNavigateLogin={() => navigation.navigate('Login')} 
    />
  );
};\n