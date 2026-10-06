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
