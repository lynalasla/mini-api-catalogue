import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const API_URL = '/api';

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`${API_URL}/cart/items`, 
        { productId, quantity }, 
        { withCredentials: true }
      );
      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(`${API_URL}/cart/items/${itemId}`, 
        { quantity }, 
        { withCredentials: true }
      );
      await loadCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/items/${itemId}`, { withCredentials: true });
      await loadCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const checkout = async () => {
    try {
      await axios.post(`${API_URL}/orders`, {}, { withCredentials: true });
      setCart([]);
      return true;
    } catch (error) {
      console.error('Checkout failed:', error);
      return false;
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal, 
      cartCount, 
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      checkout,
      loadCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
