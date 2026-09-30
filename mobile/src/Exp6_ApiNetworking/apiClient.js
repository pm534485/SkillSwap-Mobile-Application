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
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
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
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
};\n