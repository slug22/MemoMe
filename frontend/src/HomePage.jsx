import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function HomePage() {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [helperEmail, setHelperEmail] = useState('');
  const [task, setTask] = useState('');
  const navigate = useNavigate(); 

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleInfoChange = (e) => {
    setInfo(e.target.value);
  };

  const handleHelperEmailChange = (e) => {
    setHelperEmail(e.target.value);
  };

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tasksArray = task.split(',').map(t => t.trim());

    const userData = {
      user_id: name,
      base_info: info,
      tasks: tasksArray,
      helper_email: helperEmail // Include helperEmail in the userData object
    };

    try {
      const response = await axios.post('http://localhost:5000/user', userData);
      console.log('User created:', response.data);

      // Store data in localStorage
      localStorage.setItem('userName', name);
      localStorage.setItem('helperEmail', helperEmail);
      localStorage.setItem('info', info);
      localStorage.setItem('tasks', task); // Store the comma-separated tasks

      // Reset form fields
      setName('');
      setInfo('');
      setHelperEmail('');
      setTask('');

      // Navigate to TaskDisplay page with user_id
      navigate('/tasks', { state: { user_id: name } });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="App"> 
      <div className="container">
        <h1>Welcome to MemoMe</h1>
        <p className="subtext">Helping you care for someone with Alzheimer's, Dementia, or other memory impairments.</p>

        <form onSubmit={handleSubmit}> 
          <label htmlFor="name">Your Name:</label> 
          <input
            type="text"
            id="name" 
            value={name}
            onChange={handleNameChange}   
            placeholder="Enter your name"
          />

          <label htmlFor="info">Enter Information:</label> 
          <textarea
            id="info" 
            value={info}
            onChange={handleInfoChange}
            placeholder="Enter important information here..."
            rows="6"
          />

          <label htmlFor="helperEmail">Helper Email:</label> 
          <input
            type="email"
            id="helperEmail" 
            value={helperEmail}
            onChange={handleHelperEmailChange}
            placeholder="Enter helper's email"
          />

          <label htmlFor="task">Tasks (comma-separated):</label> 
          <input
            type="text"
            id="task" 
            value={task}
            onChange={handleTaskChange}
            placeholder="Enter tasks separated by commas"
          />

          <button type="submit">Submit</button> 
        </form>

       
      </div>
    </div>
  );
}

export default HomePage;