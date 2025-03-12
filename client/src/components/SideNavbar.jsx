import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css'

const SideNavbar = () => {
  return (
    <div className="sidenav">
      <h2>Winner Dashboard</h2>
      <Link to="/">Dashboard</Link>
      <Link to="/add-manager">Add Manager</Link>
      <Link to="/results">Results</Link>
      <button className="logout-btn">Logout</button>
    </div>
  );
};

export default SideNavbar;