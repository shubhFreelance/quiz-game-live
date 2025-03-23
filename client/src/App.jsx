import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNavbar from "./components/SideNavbar";
import Dashboard from "./components/Dashboard";
import AddManager from "./components/AddManager";
import Results from "./components/Results";
import "./App.css";
import Login from "./components/Login";
import { ContextApi } from "./stores/ContextApi";
import { ConfigProvider } from "antd";
import AgentDashboard from "./components/AgentDashboard";
import Betting from "./components/Betting";
import axios from "axios";

function App() {
  const { isloggedin, setisloggedin, setRole } = useContext(ContextApi);

  axios.defaults.baseURL = "http://localhost:5001";

  useEffect(() => {
    fetchAgentId();
  }, []);

  //For Maintaining states of role and login after refresh
  const fetchAgentId = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      setisloggedin(false);
    } else {
      axios
        .get("/api/agent/current-agent-id", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setRole("agent");
        })
        .catch((err) => {
          setRole("superadmin");
        });
      setisloggedin(true);
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
          {isloggedin ? <SideNavbar /> : null}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-manager" element={<AddManager />} />
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/" element={<Login />} />
            <Route path="/b" element={<Betting />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
