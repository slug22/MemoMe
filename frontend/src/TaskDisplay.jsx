import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './TaskDisplay.css';

const TaskDisplay = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;

  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showTaskList, setShowTaskList] = useState(true);
  const [hasStoppedOnce, setHasStoppedOnce] = useState(false);
  const [showSpeechResult, setShowSpeechResult] = useState(false);

  const recognition = new window.webkitSpeechRecognition(); // For Chrome

  useEffect(() => {
    recognition.continuous = false; // Get one phrase at a time
    recognition.interimResults = false; // Get final results only

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
      console.log('Speech recognized:', transcript);

      try {
        const response = await axios.post('http://localhost:5000/chat', {
          user_id,
          message: transcript
        });
        setChatResponse(response.data.response);
        console.log('Chat response:', response.data.response);

        // Text-to-Speech after receiving the response
        const utterance = new SpeechSynthesisUtterance(response.data.response);
        speechSynthesis.speak(utterance); 
      } catch (error) {
        console.error('Error sending message to chat:', error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!hasStoppedOnce) {
        setShowTaskList(false);
        setHasStoppedOnce(true);
        setTimeout(() => {
          setShowSpeechResult(true);
        }, 200); // Delay showing the speech result by 0.2 seconds
      }
    };
  }, [recognition, user_id, hasStoppedOnce]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${user_id}/tasks`);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user_id) {
      fetchTasks();
    }
  }, [user_id]);

  const handleStartListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const handleStopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return (
    <div className="task-display-container" style={{ backgroundColor: '#fef9e7', fontFamily: 'Quicksand, cursive, sans-serif' }}>
      {/* Container Box with white background */}
      <Box
        sx={{
          backgroundColor: 'white', // White background for the container
          padding: '20px', // Add some padding
          borderRadius: '10px', // Rounded corners for the container
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: add shadow for depth
          width: '30%', // Set width of the container
        }}
      >
        {/* Task list */}
        {showTaskList && (
          <Box className="task-list-box" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'black', fontFamily: 'Quicksand' }}>
              Tasks:
            </Typography>
            <ul style={{ paddingLeft: '20px' }}>
              {tasks.map((task, index) => (
                <li key={index} style={{ marginLeft: '20px' }}>{task}</li>
              ))}
            </ul>
          </Box>
        )}

        {/* Speech result box with pink border */}
        {speechResult && (
          <Box
            className={`speech-result-box ${showSpeechResult ? 'show' : ''}`}
            sx={{
              padding: '15px',
              borderRadius: '10px',
              mb: 2,
              width: '100%',
              textAlign: 'center',
              border: '2px solid', // Add border
              borderColor: '#f48fb1', // Pink border color
              opacity: showSpeechResult ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            <Typography variant="body1" sx={{ color: 'black', fontFamily: 'Montserrat' }}>
              You said: {speechResult}
            </Typography>
          </Box>
        )}

        {/* Button box */}
        <Box className="task-box">
          <Button
            variant="contained"
            onClick={isListening ? handleStopListening : handleStartListening}
            sx={{ mt: 2, backgroundColor: '#ff69b4', color: '#fff', '&:hover': { backgroundColor: '#ff1493' } }}
          >
            {isListening ? 'Stop Microphone' : 'Start Microphone'}
          </Button>
        </Box>

        {/* Chat response box with pink border */}
        <Box
          className="chat-response-box"
          sx={{
            padding: '20px',
            borderRadius: '10px',
            mt: 2,
            border: '2px solid', // Add border
            borderColor: '#f48fb1', // Pink border color
          }}
        >
          {chatResponse && (
            <Typography variant="h5" component="div" gutterBottom sx={{ color: 'black', fontFamily: 'Quicksand' }}>
              {chatResponse}
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default TaskDisplay;
