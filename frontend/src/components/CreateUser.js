import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [userId, setUserId] = useState('');
  const [baseInfo, setBaseInfo] = useState('');
  const [tasks, setTasks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user', {
        user_id: userId,
        base_info: baseInfo,
        tasks: tasks.split(',')
      });
      console.log('User created:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Base Info"
        value={baseInfo}
        onChange={(e) => setBaseInfo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tasks (comma separated)"
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
      />
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUser;