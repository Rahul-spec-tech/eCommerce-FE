import React from 'react';
import { UserProvider } from './Components/UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import RegistrationPage from './Components/RegistationPage';
import { CartProvider } from './Components/CartContext';
import CartPage from './Components/CartPage';
import SuccessPage from './Components/SuccessPage';
import CancelPage from './Components/CancelPage';

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
