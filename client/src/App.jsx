import React, { useContext } from "react";
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
  const { isloggedin } = useContext(ContextApi);

  axios.defaults.baseURL = "http://localhost:5001";

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
