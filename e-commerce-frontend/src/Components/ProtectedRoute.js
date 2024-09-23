import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    return false;
  }
  try {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime; 
  } catch (error) {
    console.error('Token error', error);
    return false; 
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) { 
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
