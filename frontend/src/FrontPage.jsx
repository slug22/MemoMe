import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function FrontPage() {
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
        <h1>Welcome to MemoMe</h1>


        <div className="image-placeholder">
        </div>

        {/* Text box */}
        <h1>Login</h1>
        <input
          type="text"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="Enter your User ID"
        />
        {error && <p className="error">{error}</p>}
        
        <p className="separator"><strong>OR</strong></p>

        {/* Buttons for Registration and Check-In */}
        <div className="button-container">
          <button className="registration-button" onClick={() => navigate('/registration')}>
            Register
          </button>
          <button className="checkin-button" onClick={() => navigate('/checkin')}>
            Check-In
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;