const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'mobile', 'src');

const files = {
  'Exp10_LocalStorage/storage.js': `
/**
 * =====================================================
 * EXPERIMENT 10: Local Storage Integration
 * File: Exp10_LocalStorage/storage.js
 * Purpose: AsyncStorage wrapper
 * Concepts: Persistence
 * =====================================================
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
const PREFIX = '@skillswap:';

export const storage = {
  set: async (key, value) => {
    try { await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)); } 
    catch (e) { console.error('Storage set error', e); }
  },
  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(PREFIX + key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Storage get error', e); return null;
    }
  },
  remove: async (key) => {
    try { await AsyncStorage.removeItem(PREFIX + key); } 
    catch (e) { console.error('Storage remove error', e); }
  },
  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(k => k.startsWith(PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (e) { console.error('Storage clear error', e); }
  }
};
`,
  'Exp10_LocalStorage/useNetworkStatus.js': `
/**
 * =====================================================
 * EXPERIMENT 10: Local Storage Integration
 * File: Exp10_LocalStorage/useNetworkStatus.js
 * Purpose: Network status hook
 * Concepts: NetInfo
 * =====================================================
 */
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(state.isConnected === false);
    });
    return unsubscribe;
  }, []);
  return isOffline;
};
`,
  'Exp6_ApiNetworking/apiClient.js': `
/**
 * =====================================================
 * EXPERIMENT 6: REST API Integration
 * File: Exp6_ApiNetworking/apiClient.js
 * Purpose: Fetch wrapper
 * Concepts: Fetch, Auth headers, AbortController
 * =====================================================
 */
import { API_URL } from '../shared/constants';
import { storage } from '../Exp10_LocalStorage/storage';

const request = async (endpoint, options = {}) => {
  const token = await storage.get('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = \`Bearer \${token}\`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(\`\${API_URL}\${endpoint}\`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(data.message || data || 'API request failed');
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

export const apiClient = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  postFormData: async (endpoint, formData) => {
    const token = await storage.get('token');
    const headers = {};
    if (token) headers.Authorization = \`Bearer \${token}\`;
    const res = await fetch(\`\${API_URL}\${endpoint}\`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
};
`,
  'Exp4_GlobalState/AuthContext.js': `
/**
 * =====================================================
 * EXPERIMENT 4: Global State Management
 * File: Exp4_GlobalState/AuthContext.js
 * Purpose: Auth Context Provider
 * Concepts: Context API, useReducer
 * Depends on: Exp6_ApiNetworking, Exp10_LocalStorage
 * =====================================================
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';
import { storage } from '../Exp10_LocalStorage/storage';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return { ...state, token: action.token, user: action.user, isLoading: false };
    case 'SIGN_IN':
      return { ...state, token: action.token, user: action.user };
    case 'SIGN_OUT':
      return { ...state, token: null, user: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      let user;
      try {
        token = await storage.get('token');
        user = await storage.get('user');
        // Optionally verify token with /api/auth/me here
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: 'RESTORE_TOKEN', token: token || null, user: user || null });
    };
    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/api/auth/login', { email, password });
    if (res.success) {
      await storage.set('token', res.data.token);
      await storage.set('user', res.data);
      dispatch({ type: 'SIGN_IN', token: res.data.token, user: res.data });
    }
  };

  const register = async (name, email, password, skillsOffered) => {
    const res = await apiClient.post('/api/auth/register', { name, email, password, skillsOffered });
    if (res.success) {
      await storage.set('token', res.data.token);
      await storage.set('user', res.data);
      dispatch({ type: 'SIGN_IN', token: res.data.token, user: res.data });
    }
  };

  const logout = async () => {
    await storage.remove('token');
    await storage.remove('user');
    dispatch({ type: 'SIGN_OUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
`,
  'Exp4_GlobalState/BookingCartContext.js': `
/**
 * =====================================================
 * EXPERIMENT 4: Global State Management
 * File: Exp4_GlobalState/BookingCartContext.js
 * Purpose: Booking Cart Context
 * Concepts: Context API, useReducer
 * =====================================================
 */
import React, { createContext, useContext, useReducer } from 'react';

const BookingCartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      if (state.find(i => i._id === action.payload._id)) return state;
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter(i => i._id !== action.payload._id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const BookingCartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const add = (gig) => dispatch({ type: 'ADD', payload: gig });
  const remove = (gig) => dispatch({ type: 'REMOVE', payload: gig });
  const clear = () => dispatch({ type: 'CLEAR' });

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <BookingCartContext.Provider value={{ cart, add, remove, clear, total, count: cart.length }}>
      {children}
    </BookingCartContext.Provider>
  );
};

export const useBookingCart = () => {
  const context = useContext(BookingCartContext);
  if (!context) throw new Error('useBookingCart must be used within a BookingCartProvider');
  return context;
};
`
};

Object.entries(files).forEach(([file, content]) => {
  const fullPath = path.join(srcDir, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
});
console.log('State, Storage, API scaffolded.');
