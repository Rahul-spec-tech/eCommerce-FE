import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css'; 

const RegistrationPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    address: {
      city: '',
      street: '',
      number: 0,
      zipcode: '',
      geolocation: {
        lat: '',
        long: '',
      },
    },
    phone: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/register', userData);
      if (response.status === 200) {
        navigate('/');  
      }
    } catch (error) {
      console.error('Registration failed', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address")) {
      const addressField = name.split(".")[1];
      setUserData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [addressField]: value },
      }));
    } 
    else if (name.includes("geolocation")) {
      const geoField = name.split(".")[1];
      setUserData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          geolocation: { ...prevData.address.geolocation, [geoField]: value },
        },
      }));
    } 
    else {
      setUserData({ ...userData, [name]: value });
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="registration-form">
        <div className="input-row">
          <div className="input-group">
            <label>First Name:</label>
            <input type="text" placeholder="First Name" name="firstname" value={userData.firstname} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Last Name:</label>
            <input type="text" placeholder="Last Name" name="lastname" value={userData.lastname} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Email Id:</label>
            <input type="email" placeholder="Email" name="email" value={userData.email} onChange={handleChange}/>
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Username:</label>
            <input type="text" placeholder="Username" name="username" value={userData.username} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input type="password" placeholder="Password" name="password" value={userData.password} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Phone Number:</label>
            <input type="text" placeholder="Phone" name="phone" value={userData.phone} onChange={handleChange}/>
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>City:</label>
            <input type="text" placeholder="City" name="address.city" value={userData.address.city} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Street:</label>
            <input type="text" placeholder="Street" name="address.street" value={userData.address.street} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Door No.</label>
            <input type="number" placeholder="House Number" name="address.number" value={userData.address.number} onChange={handleChange}/>
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Zip Code:</label>
            <input type="text" placeholder="Zipcode" name="address.zipcode" value={userData.address.zipcode} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Latitude:</label>
            <input type="text" placeholder="Latitude" name="geolocation.lat" value={userData.address.geolocation.lat} onChange={handleChange}/>
          </div>

          <div className="input-group">
            <label>Longitude:</label>
            <input type="text" placeholder="Longitude" name="geolocation.long" value={userData.address.geolocation.long} onChange={handleChange}/>
          </div>
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
