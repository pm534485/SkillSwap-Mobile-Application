/**
 * =====================================================
 * EXPERIMENT 12: App Optimization and Final Build Prep
 * File: Exp12_Optimization/perfUtils.js
 * Purpose: Helpers for performance logging
 * Concepts: Optimization
 * =====================================================
 */
import React, { useRef, useEffect } from 'react';

export const withPerfLog = (WrappedComponent, componentName) => {
  return (props) => {
    const renderCount = useRef(0);
    useEffect(() => {
      renderCount.current += 1;
      if (__DEV__) {
        console.log(\`[\${componentName}] render #\${renderCount.current}\`);
      }
    });
    return <WrappedComponent {...props} />;
  };
};
