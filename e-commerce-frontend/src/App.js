import React, { useEffect, useState } from 'react';
import { UserProvider } from './Components/UserContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import RegistrationPage from './Components/RegistationPage';
import { CartProvider } from './Components/CartContext';
import CartPage from './Components/CartPage';
import SuccessPage from './Components/SuccessPage';
import CancelPage from './Components/CancelPage';
//import {jwtDecode} from 'jwt-decode'; 
import ProtectedRoute from './Components/ProtectedRoute';
import axios from 'axios';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/checkAuth', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (response.data.redirect) {
          setIsAuth(true);
        }
      } catch (error) {
        console.error('Error checking authentication', error);
      }
    };
    checkAuth();
  }, []);

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
            <Route path="/cancel" element={<ProtectedRoute><CancelPage /></ProtectedRoute>} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;