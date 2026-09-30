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
};\n