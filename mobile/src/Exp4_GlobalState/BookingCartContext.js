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
};\n