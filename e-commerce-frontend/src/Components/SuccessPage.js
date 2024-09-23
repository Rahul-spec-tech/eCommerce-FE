import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () =>{
    const navigate = useNavigate();
    return (
        <div className="text-center mt-20">
        <h1 className="text-2xl font-semibold mb-4">Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          onClick={() => navigate('/home')}
        >
          Go to Home
        </button>
      </div>
    );
};
export default SuccessPage;