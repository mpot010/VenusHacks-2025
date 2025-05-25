import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Welcome from './pages/welcome';
import Create from './pages/create';
import Dashboard from './pages/dashboard';
import Look from './pages/look';
import Routine from './pages/routine';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/look" element={<Look />} />
        <Route path="/routine" element={<Routine />} />
      </Routes>
    </Router>
  );
}

export default App;
