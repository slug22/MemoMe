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

  const recognition = new window.webkitSpeechRecognition(); // For Chrome

  useEffect(() => {
    recognition.continuous = false; // Get one phrase at a time
    recognition.interimResults = false; // Get final results only

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
      console.log('Speech recognized:', transcript);

      // Send the recorded message text along with user_id to the /chat endpoint
      try {
        const response = await axios.post('http://localhost:5000/chat', {
          user_id,
          message: transcript
        });
        setChatResponse(response.data.response);
        console.log('Chat response:', response.data.response);
      } catch (error) {
        console.error('Error sending message to chat:', error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition, user_id]);

  const handleStartListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const handleStopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return (
    <div className="task-display-container"> {/* Add a container for styling */}
      <Box className="task-box"> {/* Add a class to the Box */}
        {chatResponse && (
          <Typography variant="h5" component="div" gutterBottom>
            {chatResponse}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={isListening ? handleStopListening : handleStartListening}
          sx={{ mt: 2 }}
        >
          {isListening ? 'Stop Microphone' : 'Start Microphone'}
        </Button>

        {speechResult && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            You said: {speechResult}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default TaskDisplay;