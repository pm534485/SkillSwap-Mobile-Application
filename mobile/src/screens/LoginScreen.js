/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: screens/LoginScreen.js
 * Purpose: Login composition wrapper
 * Concepts: Form wiring, Auth context
 * Depends on: Exp1_BasicUI, Exp4_GlobalState, Exp5_FormValidation
 * =====================================================
 */
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { LoginScreenUI } from '../Exp1_BasicUI/LoginScreenUI';
import { useForm } from '../Exp5_FormValidation/useForm';
import { validateLogin } from '../Exp5_FormValidation/validators';
import { useAuth } from '../Exp4_GlobalState/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({ email: '', password: '' }, validateLogin, async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <LoginScreenUI 
      form={form} 
      loading={loading} 
      onNavigateRegister={() => navigation.navigate('Register')} 
    />
  );
};\n