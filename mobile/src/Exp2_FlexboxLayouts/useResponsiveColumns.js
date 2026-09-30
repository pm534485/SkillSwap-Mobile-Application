/**
 * =====================================================
 * EXPERIMENT 2: Flexbox and Responsive Layouts
 * File: Exp2_FlexboxLayouts/useResponsiveColumns.js
 * Purpose: Hook to determine column count based on viewport
 * Concepts: Responsive design, Dimensions
 * Depends on: Shared ViewportContext
 * =====================================================
 */
import { useViewportSize } from '../shared/WebPhoneFrame';
import { breakpoints } from './responsive';

export const useResponsiveColumns = () => {
  const { width } = useViewportSize();
  if (width < breakpoints.narrow) return 1;
  if (width >= breakpoints.tablet) return 3;
  return 2;
};
