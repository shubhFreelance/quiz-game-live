import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNavbar from './components/SideNavbar';
import Dashboard from './components/Dashboard';
import AddManager from './components/AddManager';
import Results from './components/Results';
import './App.css';
function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <SideNavbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-manager" element={<AddManager />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;