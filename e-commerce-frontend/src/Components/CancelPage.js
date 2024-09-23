import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-semibold mb-4">Payment Cancelled</h1>
      <p>Your payment was not completed. Please try again.</p>
      <button 
        className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
        onClick={() => navigate('/cart')}
      >
        Return to Cart
      </button>
    </div>
  );
};

export default CancelPage;
