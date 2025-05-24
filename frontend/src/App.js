import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/welcome';
import Create from './pages/create';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
