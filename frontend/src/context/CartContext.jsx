import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodhub_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('foodhub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x._id === existItem._id ? { ...product, quantity: x.quantity + 1 } : x
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  [cartItems]);

  const cartCount = useMemo(() => 
    cartItems.reduce((count, item) => count + item.quantity, 0),
  [cartItems]);

  const value = useMemo(() => ({
    cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);