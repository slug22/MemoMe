
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './FrontPage'; // Ensure this path is correct
import HomePage from './HomePage';
import TaskDisplay from './TaskDisplay';
import HelperPage from './HelperPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/registration" element={<HomePage />} />
        <Route path="/tasks" element={<TaskDisplay />} />
        <Route path="/checkin" element={<HelperPage />} />
      </Routes>
    </Router>
  );
}

export default App;
