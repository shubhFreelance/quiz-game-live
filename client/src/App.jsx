// import React, { useContext, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";
// import SideNavbar from "./components/SideNavbar";
// import Dashboard from "./components/Dashboard";
// import AddManager from "./components/AddManager";
// import Results from "./components/Results";
// import "./App.css";
// import Login from "./components/Login";
// import { ContextApi } from "./stores/authContext";
// import { useAuth } from "./stores/authContext";
// import { ConfigProvider } from "antd";
// import AgentDashboard from "./components/AgentDashboard";
// import Betting from "./components/Betting";
// import axios from "axios";

// // const navigate = useNavigate();

// function App() {
//   const { isloggedin, setIsloggedin, setRole } = useAuth()

//   axios.defaults.baseURL = "http://localhost:5001";

//   useEffect(() => {
//     fetchAgentId();
//   }, []);

//   //For Maintaining states of role and login after refresh
//   const fetchAgentId = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       // window.location.href = "/";

//       setIsloggedin(false);
//     } else {
//       axios
//         .get("/api/agent/current-agent-id", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         .then((res) => {
//           console.log("Agent Id", res.data);
//           setRole("agent");
//         })
//         .catch((err) => {
//           setRole("superadmin");
//         });
//       setIsloggedin(true);
//     }
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorBgElevated: "#141414",
//           colorText: "white",
//         },
//       }}
//     >
//       <Router>
//         <div style={{ display: "flex" }}>
//           {isloggedin ? <SideNavbar /> : null}
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/add-manager" element={<AddManager />} />
//             <Route
//               path="/agent"
//               element={
//                 <ProtectedRoute>
//                   <AgentDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/results" element={<Results />} />
//             <Route path="/" element={<Login />} />
//             <Route path="/b" element={<Betting />} />
//           </Routes>
//         </div>
//       </Router>
//     </ConfigProvider>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SideNavbar from "./components/SideNavbar";
import Dashboard from "./components/Dashboard";
import AddManager from "./components/AddManager";
import Results from "./components/Results";
import "./App.css";
import Login from "./components/Login";
import { useAuth } from "./stores/authContext";
import { ConfigProvider } from "antd";
import AgentDashboard from "./components/AgentDashboard";
import Betting from "./components/Betting";
import axios from "axios";

// ProtectedRoute component to restrict access to authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  // Redirect to the appropriate dashboard based on role
  if (user?.role === "agent" && window.location.pathname !== "/agent") {
    return <Navigate to="/agent" />;
  }

  if (user?.role === "superadmin" && window.location.pathname === "/agent") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  axios.defaults.baseURL = "http://api.goawinner.fun";

  // Fetch user data and set authentication state on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data and set authentication state after refresh
  const fetchUserData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout(); // Log out if no token is found
    } else {
      axios
        .get("/api/auth/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const { userId, role } = res.data;
          login({ userId, role }); 
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          logout(); // Log out if the token is invalid
        });
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "#141414",
          colorText: "white",
        },
      }}
    >
      <Router>
        <div style={{ display: "flex" }}>
          {isAuthenticated ? <SideNavbar /> : null}
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-manager"
              element={
                <ProtectedRoute>
                  <AddManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Login />} />
            <Route
              path="/b"
              element={
                <ProtectedRoute>
                  <Betting />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;