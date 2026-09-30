const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'mobile', 'src');

const files = {
  'Exp1_BasicUI/AppText.js': `
/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/AppText.js
 * Purpose: Primitive text component
 * Concepts: StyleSheet, Text
 * =====================================================
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../shared/theme';

export const AppText = ({ children, style, variant = 'body', ...props }) => {
  return <Text style={[styles[variant], style]} {...props}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: { ...theme.typography.title, color: theme.colors.text },
  subtitle: { ...theme.typography.subtitle, color: theme.colors.text },
  body: { ...theme.typography.body, color: theme.colors.text },
  caption: { ...theme.typography.caption }
});
`,
  'Exp1_BasicUI/AppButton.js': `
/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/AppButton.js
 * Purpose: Primitive button component
 * Concepts: TouchableOpacity, Pressable
 * =====================================================
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../shared/theme';

export const AppButton = ({ title, onPress, disabled, loading, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled, style]} 
      onPress={onPress} 
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.s,
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
`,
  'Exp1_BasicUI/AppInput.js': `
/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/AppInput.js
 * Purpose: Primitive input component
 * Concepts: TextInput, UI state
 * =====================================================
 */
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../shared/theme';

export const AppInput = ({ label, error, secureTextEntry, ...props }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.errorContainer]}>
        <TextInput 
          style={styles.input} 
          secureTextEntry={isSecure} 
          placeholderTextColor={theme.colors.textSecondary}
          {...props} 
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.toggle}>
            <Text style={styles.toggleText}>{isSecure ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: theme.spacing.s },
  label: { marginBottom: 4, fontWeight: '500', color: theme.colors.text },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    alignItems: 'center'
  },
  errorContainer: { borderColor: theme.colors.error },
  input: { flex: 1, padding: theme.spacing.m, color: theme.colors.text },
  toggle: { paddingHorizontal: 10 },
  toggleText: { color: theme.colors.primary, fontWeight: '500' },
  errorText: { color: theme.colors.error, fontSize: 12, marginTop: 4 }
});
`,
  'Exp1_BasicUI/LoginScreenUI.js': `
/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/LoginScreenUI.js
 * Purpose: Pure UI for login
 * Concepts: KeyboardAvoidingView, ScrollView
 * =====================================================
 */
import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { theme } from '../shared/theme';

export const LoginScreenUI = ({ form, onNavigateRegister, loading }) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="title" style={styles.title}>SkillSwap</AppText>
        <AppText variant="subtitle" style={styles.subtitle}>Welcome back!</AppText>
        
        <AppInput 
          label="Email" 
          value={form.values.email} 
          onChangeText={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
          error={form.touched.email && form.errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput 
          label="Password" 
          value={form.values.password} 
          onChangeText={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
          error={form.touched.password && form.errors.password}
          secureTextEntry
        />
        
        <AppButton 
          title="Login" 
          onPress={form.handleSubmit} 
          loading={loading}
          disabled={!form.isValid}
          style={{ marginTop: 24 }}
        />
        <AppButton 
          title="Create an account" 
          onPress={onNavigateRegister} 
          style={styles.linkButton} 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.xl, flexGrow: 1, justifyContent: 'center' },
  title: { textAlign: 'center', color: theme.colors.primary, marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 32 },
  linkButton: { backgroundColor: 'transparent', marginTop: 8 }
});
`,
  'Exp1_BasicUI/RegisterScreenUI.js': `
/**
 * =====================================================
 * EXPERIMENT 1: Basic UI Components
 * File: Exp1_BasicUI/RegisterScreenUI.js
 * Purpose: Pure UI for registration
 * Concepts: KeyboardAvoidingView, ScrollView
 * =====================================================
 */
import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { theme } from '../shared/theme';

export const RegisterScreenUI = ({ form, onNavigateLogin, loading }) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="title" style={styles.title}>Join SkillSwap</AppText>
        
        <AppInput 
          label="Name" 
          value={form.values.name} 
          onChangeText={form.handleChange('name')}
          onBlur={form.handleBlur('name')}
          error={form.touched.name && form.errors.name}
        />
        <AppInput 
          label="Campus Email" 
          value={form.values.email} 
          onChangeText={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
          error={form.touched.email && form.errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput 
          label="Password" 
          value={form.values.password} 
          onChangeText={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
          error={form.touched.password && form.errors.password}
          secureTextEntry
        />
        <AppInput 
          label="Confirm Password" 
          value={form.values.confirmPassword} 
          onChangeText={form.handleChange('confirmPassword')}
          onBlur={form.handleBlur('confirmPassword')}
          error={form.touched.confirmPassword && form.errors.confirmPassword}
          secureTextEntry
        />
        <AppInput 
          label="Skills I offer (comma separated)" 
          value={form.values.skills} 
          onChangeText={form.handleChange('skills')}
          onBlur={form.handleBlur('skills')}
        />
        
        <AppButton 
          title="Sign Up" 
          onPress={form.handleSubmit} 
          loading={loading}
          disabled={!form.isValid}
          style={{ marginTop: 24 }}
        />
        <AppButton 
          title="Already have an account?" 
          onPress={onNavigateLogin} 
          style={styles.linkButton} 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.l, flexGrow: 1, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 24 },
  linkButton: { backgroundColor: 'transparent', marginTop: 8 }
});
`,
  'Exp5_FormValidation/useForm.js': `
/**
 * =====================================================
 * EXPERIMENT 5: Form Validation
 * File: Exp5_FormValidation/useForm.js
 * Purpose: Custom hook for form state
 * Concepts: Validation, State management
 * =====================================================
 */
import { useState, useCallback, useMemo } from 'react';

export const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const currentErrors = validate({ ...values, [field]: value });
      setErrors(prev => ({ ...prev, [field]: currentErrors[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const currentErrors = validate(values);
    setErrors(prev => ({ ...prev, [field]: currentErrors[field] }));
  };

  const handleSubmit = useCallback(() => {
    const currentErrors = validate(values);
    setErrors(currentErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    if (Object.keys(currentErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(validate(values)).length === 0;
  }, [values, validate]);

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, isValid };
};
`,
  'Exp5_FormValidation/validators.js': `
/**
 * =====================================================
 * EXPERIMENT 5: Form Validation
 * File: Exp5_FormValidation/validators.js
 * Purpose: Validation rules
 * Concepts: Regex, Validation logic
 * =====================================================
 */
export const validateLogin = (values) => {
  const errors = {};
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(values.email)) errors.email = 'Invalid email';
  if (!values.password) errors.password = 'Password is required';
  return errors;
};

export const validateRegister = (values) => {
  const errors = {};
  if (!values.name) errors.name = 'Name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(values.email)) errors.email = 'Invalid email';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Min 6 characters';
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateGig = (values) => {
  const errors = {};
  if (!values.title) errors.title = 'Title is required';
  if (!values.description) errors.description = 'Description is required';
  if (!values.category) errors.category = 'Category is required';
  if (!values.price || isNaN(values.price)) errors.price = 'Valid price is required';
  if (!values.durationMinutes || isNaN(values.durationMinutes)) errors.durationMinutes = 'Valid duration is required';
  if (!values.location) errors.location = 'Location is required';
  if (!values.availability) errors.availability = 'Availability is required';
  return errors;
};
`,
  'screens/LoginScreen.js': `
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
};
`,
  'screens/RegisterScreen.js': `
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
};
`
};

Object.entries(files).forEach(([file, content]) => {
  const fullPath = path.join(srcDir, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
});

console.log('UI and Form Validation scaffolded.');
