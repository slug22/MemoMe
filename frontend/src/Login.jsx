import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserId = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/user/${userId}`);
          if (response.status === 200) {
            navigate('/tasks', { state: { user_id: userId } });
          }
        } catch (err) {
          setError('User ID not found');
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      checkUserId();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [userId, navigate]);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setError('');
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Login</h1>
        <input
          type="text"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="Enter your User ID"
        />
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;