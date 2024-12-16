import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext'; 
import { useCart } from './CartContext';

const HomePage = () => {
  const { user } = useUser();
  const { cart } = useCart();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } 
    else {
      axios.get('http://localhost:8080/products/categories')
        .then(response => {
          const categoryData = response.data || [];
          setCategories(categoryData);
          categoryData.forEach(category => {
            axios.get(`http://localhost:8080/products/category/${category}`)
              .then(res => {
                setProductsByCategory(prev => ({
                  ...prev,
                  [category]: res.data
                }));
              })
              .catch(err => console.log(err));
          });
        })
        .catch(err => console.log(err));
    }
  }, [user, navigate]);

  const handleUserUpdate = () => {
    console.log("Update Form");
  };

  const handleUserProfile = () => {
    console.log('User Profile');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBuyNow = (productId) => {
    console.log(`Buying product with ID: ${productId}`);
  };

  const handleAddToCart = async (product) => {
    const productId = product.id || product._id.toString();
    const userId = user?._id?.toString();
    console.log(productId);
    console.log(userId);
    if (!userId || !productId) {
      console.error('User ID or Product ID is missing');
      return;
    }
  
    try {
      await addToCart({ userId, productId });
      navigate('/cart'); 
      alert('Product added successfully');
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <div className="mt-0 bg-gray-100">
      <nav className="bg-blue-600 text-white fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 z-10">
        <div className="text-lg font-bold">E-commerce App</div>
        <div className="text-center flex-grow">Hello, {user?.username || 'Guest'}!</div>
        <div className="relative">
          <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">Menu</button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <button onClick={handleUserUpdate} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">Update</button>
              <button onClick={handleUserProfile} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">Profile</button>
              <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">Logout</button>
            </div>
          )}
        </div>
        <button onClick={() => navigate('/cart')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Cart ({cart.length})</button>
      </nav>

      <div className="mt-110 pt-72 px-20">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category} className="my-10">
              <h2 className="text-2xl font-semibold mb-8">{category}</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {productsByCategory[category]?.map(product => (
                  <div key={product._id} className="w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md flex flex-col justify-between">
                    <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-4 rounded-md" />
                    <p className="text-lg font-medium mb-2">Price: {product.price} Rs</p>
                    <p className="text-sm text-gray-600 mb-2">{product.title}</p>
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <button onClick={() => handleBuyNow(product._id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buy Now</button>
                      <button onClick={() => handleAddToCart(product)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>products...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;