import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { ContextApi } from "../stores/ContextApi";

const SideNavbar = () => {
  const { setisloggedin, role } = useContext(ContextApi);
  const navigate = useNavigate();

  console.log(role);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setisloggedin(false);
    navigate("/");
  };
  return (
    <div className="sidenav">
      <h2>Winner Dashboard</h2>
      {role === "superadmin" ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <Link to="/agent">Dashboard</Link>
      )}
      {role === "superadmin" && <Link to="/add-manager">Add Manager</Link>}
      {role === "superadmin" && <Link to="/results">Session & Results</Link>}
      <button className="logout-btn" onClick={handleLogOut}>
        Logout
      </button>
    </div>
  );
};

export default SideNavbar;
