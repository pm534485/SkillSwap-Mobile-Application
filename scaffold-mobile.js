const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'mobile', 'src');

const dirs = [
  'shared',
  'Exp1_BasicUI',
  'Exp2_FlexboxLayouts',
  'Exp3_Navigation',
  'Exp4_GlobalState',
  'Exp5_FormValidation',
  'Exp6_ApiNetworking',
  'Exp7_AdvancedLists',
  'Exp8_NativeFeatures',
  'Exp9_AnimationsGestures',
  'Exp10_LocalStorage',
  'Exp12_Optimization',
  'screens'
];

dirs.forEach(d => {
  const dirPath = path.join(srcDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

const themeContent = `
/**
 * =====================================================
 * Shared: theme.js
 * =====================================================
 */
export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    error: '#FF3B30',
    success: '#34C759',
    border: '#C6C6C8'
  },
  spacing: {
    xs: 4, s: 8, m: 16, l: 24, xl: 32
  },
  typography: {
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 14, color: '#8E8E93' }
  }
};
`;

const constantsContent = `
/**
 * =====================================================
 * Shared: constants.js
 * =====================================================
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }
  if (Constants.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    return \`http://\${host}:5000\`;
  }
  return 'http://10.0.2.2:5000';
};

export const API_URL = getApiUrl();
`;

const loggerContent = `
/**
 * =====================================================
 * Shared: logger.js
 * =====================================================
 */
export const logger = {
  log: (...args) => {
    if (__DEV__) console.log(...args);
  },
  error: (...args) => {
    if (__DEV__) console.error(...args);
  }
};
`;

fs.writeFileSync(path.join(srcDir, 'shared', 'theme.js'), themeContent.trim());
fs.writeFileSync(path.join(srcDir, 'shared', 'constants.js'), constantsContent.trim());
fs.writeFileSync(path.join(srcDir, 'shared', 'logger.js'), loggerContent.trim());

const readmeTitles = [
  'BasicUI', 'FlexboxLayouts', 'Navigation', 'GlobalState', 'FormValidation',
  'ApiNetworking', 'AdvancedLists', 'NativeFeatures', 'AnimationsGestures', 'LocalStorage'
];

readmeTitles.forEach((t, i) => {
  const num = i + 1;
  fs.writeFileSync(path.join(srcDir, \`Exp\${num}_\${t}\`, \`README_Exp\${num}.md\`), \`# Experiment \${num}: \${t}\\n\\nObjective: ...\\n\`);
});
fs.writeFileSync(path.join(srcDir, \`Exp12_Optimization\`, \`README_Exp12.md\`), \`# Experiment 12: Optimization\\n\\nObjective: ...\\n\`);

console.log('Mobile skeleton created.');
