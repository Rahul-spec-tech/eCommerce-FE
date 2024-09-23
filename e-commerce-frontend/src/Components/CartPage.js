import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';  

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  console.log(cart);
  const totalPrice = cart.reduce((total, item) => {
    const productPrice = item.productDetails?.price || 0;
    const quantity = item.quantity || 1;
    const serviceCharge = quantity *20;
    return total + (productPrice * quantity + serviceCharge);
  }, 0);

  const handleQuantity = (productId, act) => {
    updateQuantity(productId, act);
  };

  const makePayment = async () => {
    //const stripeKey = process.env.REACT_APP_STRIPE_KEY;
    const stripeKey = "pk_test_51Q1qob02S3FGbgr7B7kToSm98TKtrfzhOeikonDL7XpCBatCay8y5VBHNFjkyI4rMIVvA2F07Ja52Dykgc7nVH7r00aduaGFSU";
    //console.log("Stripe Key: ", stripeKey);
    const stripe = await loadStripe(stripeKey);
  
    const body = {
      cartItems: cart, 
    };
  
    const headers = {
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await fetch(`http://localhost:8080/payment/create-checkout-session`, {method: 'POST', headers: headers, body: JSON.stringify(body),});
      const session = await response.json();
      //console.log("Session Response: ", session);
      
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.error('Payment Error:', error);
    }
  };

  return (
    <div className="pt-20 px-4 sm:px-8">
      <h1 className="text-2xl font-semibold mb-8 text-center">Your Cart</h1>
      {cart.length > 0 ? (
        <div className="flex flex-col space-y-6">
          {cart.map((item) => (
            <div key={item.productId || item._id || item._id + 'fallback'} className="bg-white border border-gray-200 rounded-lg p-4 shadow-md flex flex-col md:flex-row md:space-x-4">
              <img
                src={item.productDetails?.image || 'default-image.png'}
                alt={item.productDetails?.title || 'Product Image'}
                className="w-full h-40 object-cover mb-4 rounded-md md:w-40 md:mb-0"
              />
              <div className="flex-1">
                <p className="text-lg font-medium mb-2">
                  Title: {item.productDetails?.title || 'N/A'}
                </p>
                <p className="text-lg font-medium mb-2">
                  Price: {item.productDetails?.price ? `${item.productDetails.price} Rs` : ''}
                </p>

                <div className="text-lg font-medium mb-2">
                  Quantity:
                  <div className="flex items-center space-x-2">
                    <button type="button" className="bg-green-500 text-white font-semibold py-1 px-2 rounded transition duration-200 hover:bg-green-600" onClick={() => handleQuantity(item.productId, 1)}>+</button>
                    <span>{item.quantity || ''}</span>
                    <button type="button" className="bg-red-500 text-white font-semibold py-1 px-2 rounded transition duration-200 hover:bg-red-600" onClick={() => handleQuantity(item.productId, -1)}>-</button>
                  </div>
                </div>
                <p className="text-lg font-medium mb-2">
                  Subtotal: {item.productDetails?.price ? `${item.productDetails.price * item.quantity} Rs` : ''}
                </p>
                <p className="text-lg font-medium mb-2">
                  Description: {item.productDetails?.description || 'No description available'}
                </p>
              </div>
              <div className="flex justify-center">
                <button onClick={() => removeFromCart(item.productId)} className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 mt-20 mb-20">Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Your cart is empty.</p>
      )}

      {cart.length > 0 && (
        <div className="mt-8 text-right">
          <p>Service Charge: 20 Rs</p>
          <button onClick = {makePayment} className="bg-green-500 text-white font-semibold py-1 px-2 rounded transition duration-200 hover:bg-green-600">Total: {totalPrice} Rs</button>
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <button onClick={() => navigate('/home')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Home Page</button>
      </div>
    </div>
  );
};

export default CartPage;
