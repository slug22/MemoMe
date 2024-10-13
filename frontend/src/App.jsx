// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; 
import TaskDisplay from './TaskDisplay';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TaskDisplay />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;