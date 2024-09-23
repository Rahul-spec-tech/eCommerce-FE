import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useUser();

  const fetchCartFromServer = async (userId) => {
    if (!userId) {
      console.error('User ID is missing');
      return [];
    }
    try {
      const response = await axios.get(`http://localhost:8080/carts/user/${userId}`);
      const cartData = response.data.products || [];
      const productDetailsData = cartData.map(async (item) => {
        const productId = item.productId;
        if (!productId) {
          return { ...item, productDetails: null };
        }
        try {
          const productResponse = await axios.get(`http://localhost:8080/products/${productId}`);
          return { ...item, productDetails: productResponse.data };
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error.response ? error.response.data : error.message);
          return { ...item, productDetails: null };
        }
      });
  
      const productsWithDetails = await Promise.all(productDetailsData);
      return productsWithDetails;
    } catch (err) {
      console.error('Error fetching cart:', err.response ? err.response.data : err.message);
      return [];
    }
  };

  useEffect(() => {
    const loadUserCart = async () => {
      if (user?._id) {
        const userCart = await fetchCartFromServer(user._id);
        setCart(userCart);
      }
    };
    loadUserCart();
  }, [user]);

  const addToCart = async ({ userId, productId }) => {
    if (!userId || !productId) {
      console.error('User ID or Product ID is missing');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/carts/add', { userId: userId.toString(), productId: productId.toString() });

      if (response.status === 200) {
        const updatedCart = await fetchCartFromServer(userId);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
    }
  };

  const updateQuantity = async (productId, act) => {
    if(!user._id || !productId) {
      console.error('User Id or ProductId is missing');
      return;
    }
    try{
      const response = await axios.put('http://localhost:8080/carts/update-quantity', { userId: user._id, productId, act,});
      if(response.status === 200){
        const updatedCart = await fetchCartFromServer(user._id);
        setCart(updatedCart);
      }
    }
    catch (error){
      console.error('Error updated Quantity', error.response? error.response.data : error.message);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?._id || !productId) {
      console.error('User ID or Product ID is missing');
      return;
    }
    try {
      const response = await axios.delete('http://localhost:8080/carts/remove', { data: { userId: user._id, productId } });
      if (response.status === 200) {
        const updatedCart = await fetchCartFromServer(user._id);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
