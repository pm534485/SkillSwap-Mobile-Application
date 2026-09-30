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
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) errors.email = 'Invalid email';
  if (!values.password) errors.password = 'Password is required';
  return errors;
};

export const validateRegister = (values) => {
  const errors = {};
  if (!values.name) errors.name = 'Name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) errors.email = 'Invalid email';
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
};\n