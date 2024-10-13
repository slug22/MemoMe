import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [uncompletedTasks, setUncompletedTasks] = useState([]);

  const fetchUncompletedTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/tasks/uncompleted/${userId}`);
      setUncompletedTasks(res.data.uncompleted_tasks);
    } catch (error) {
      console.error('Error fetching uncompleted tasks:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/chat', {
        user_id: userId,
        message: message
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      {response && <div><strong>Response:</strong> {response}</div>}
    </div>
  );
};

export default Chat;