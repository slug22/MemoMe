import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust this to match your Flask server URL

function App() {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      setUserInfo(response.data);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user`, {
        user_id: userId,
        base_info: {
          name: 'John Doe',
          birth_date: '1950-01-01',
          children: [
            { name: 'Alice', age: 35 },
            { name: 'Bob', age: 32 }
          ]
        },
        tasks: ['Take medicine', 'Go for a walk']
      });
      setUserInfo(response.data);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        user_id: userId,
        message: message
      });
      setChatHistory([...chatHistory, { user: message, bot: response.data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '') return;
    const updatedTasks = [...tasks, newTask];
    try {
      await axios.put(`${API_BASE_URL}/user/${userId}/tasks`, {
        tasks: updatedTasks
      });
      setTasks(updatedTasks);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddAction = async (action) => {
    try {
      await axios.post(`${API_BASE_URL}/action`, {
        user_id: userId,
        action: action
      });
      alert('Action added successfully');
    } catch (error) {
      console.error('Error adding action:', error);
    }
  };

  return (
    <div className="App">
      <h1>Alzheimer's Assistant</h1>
      <div>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
        />
        <button onClick={handleCreateUser}>Create/Get User</button>
      </div>
      {userInfo && (
        <div>
          <h2>User Info</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          <h3>Tasks</h3>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <button onClick={handleAddTask}>Add Task</button>
          <h3>Add Action</h3>
          <button onClick={() => handleAddAction("Took medicine")}>Took Medicine</button>
          <button onClick={() => handleAddAction("Went for a walk")}>Went for a Walk</button>
        </div>
      )}
      <h2>Chat</h2>
      <div>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p><strong>You:</strong> {chat.user}</p>
            <p><strong>Bot:</strong> {chat.bot}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;