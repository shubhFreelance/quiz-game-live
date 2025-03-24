// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/Dashboard.css";
// import { useAuth } from "../stores/authContext";
// // import { ContextApi } from "../stores/authContext";

// const SideNavbar = () => {
//   // const { setisloggedin, isLoggedIn, role } = useContext(ContextApi);
//   const {login} = useAuth();
//   const navigate = useNavigate();

//   // console.log(role);

//   // const handleLogOut = () => {
//   //   localStorage.removeItem("token");
//   //   setisloggedin(false);
//   //   navigate("/");
//   // };
//   return (
//     isLoggedIn && (
//     <div className="sidenav">
//       <h2>Winner Dashboard</h2>
//       {role === "superadmin" ? (
//         <Link to="/dashboard">Dashboard</Link>
//       ) : (
//         <Link to="/agent">Dashboard</Link>
//       )}
//       {role === "superadmin" && <Link to="/add-manager">Add Manager</Link>}
//       {role === "superadmin" && <Link to="/results">Session & Results</Link>}
//       <button className="logout-btn" onClick={handleLogOut}>
//         Logout
//       </button>
//     </div>
//     )
//   );
// };

// export default SideNavbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { useAuth } from "../stores/authContext";

const SideNavbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth(); // Use isAuthenticated, user, and logout from AuthContext
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/"); // Redirect to the login page
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    isAuthenticated && ( // Only render the sidebar if the user is authenticated
      <div className="sidenav">
        <h2>Winner Dashboard</h2>
        {user?.role === "superadmin" ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/agent">Dashboard</Link>
        )}
        {user?.role === "superadmin" && <Link to="/add-manager">Add Manager</Link>}
        {user?.role === "superadmin" && <Link to="/results">Session & Results</Link>}
        <button className="logout-btn" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    )
  );
};

export default SideNavbar;