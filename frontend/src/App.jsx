import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; 
import TaskDisplay from './TaskDisplay';
import HelperPage from './HelperPage';
import Login from './Login'; // Import the Login component

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TaskDisplay />} />
        <Route path="/helper" element={<HelperPage />} />
        <Route path="/login" element={<Login />} /> {/* Add the Login route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;