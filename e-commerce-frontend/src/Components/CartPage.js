import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const navigateHomePage = () => {
    navigate('/home');
  };

  return (
    <div className="pt-20 px-8">
      <h1 className="text-2xl font-semibold mb-8">Your Cart</h1>
      {cart.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {cart.map((item) => (
            <div
              key={item.productId || item._id || item._id + 'fallback'}
              className="w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md flex flex-col"
            >
              <img
                src={item.productDetails?.image || 'default-image.png'}
                alt={item.productDetails?.title || 'Product Image'}
                className="w-full h-40 object-cover mb-4 rounded-md"
              />
              <p className="text-lg font-medium mb-2">
                Title: {item.productDetails?.title || 'N/A'}
              </p>
              <p className="text-lg font-medium mb-2">
                Price: {item.productDetails?.price ? `${item.productDetails.price} Rs` : ''}
              </p>
              <p className="text-lg font-medium mb-2">
                Quantity: {item.quantity || ''}
              </p>
              <p className="text-lg font-medium mb-2">
                Description: {item.productDetails?.description || 'No description available'}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleRemoveFromCart(item.productId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}

      <div className="fixed bottom-4 right-4">
        <button onClick={navigateHomePage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Home Page</button>
      </div>
    </div>
  );
};

export default CartPage;
