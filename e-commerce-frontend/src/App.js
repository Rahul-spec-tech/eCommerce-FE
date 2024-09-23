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
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from './Components/ProtectedRoute';

const isAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.log("No auth token found");
    return false;
  }
  try {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;
    console.log("Decoded Token:", decodedToken);
    console.log("Current Time:", currentTime);
    console.log("Token Expiration Time:", decodedToken.exp);
    return decodedToken.exp > currentTime; 
  } catch (error) {
    console.error('Token error', error);
    return false;
  }
};

const App = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
    };
    checkAuth();
  }, []);

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} /> */}
            <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/login" />} /> */}
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
            <Route path="/cancel" element={<ProtectedRoute><CancelPage /></ProtectedRoute>} />
            <Route path="/register" element={<RegistrationPage />} />
            {/* <Route path="/cart" element={isAuth ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/success" element={isAuth ? <SuccessPage /> : <Navigate to="/login" />} />
            <Route path="/cancel" element={isAuth ? <CancelPage /> : <Navigate to="/login" />} /> */}
            <Route path="*" element={isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;