import { Tooltip } from "antd";
import React from "react";
import { BarChart, Bar, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import "../styles/Dashboard.css";
import Betting from "./Betting";

const AgentDashboard = () => {
  const barData = [
    { name: "1", amount: 2400 },
    { name: "2", amount: 1398 },
    { name: "3", amount: 9800 },
    { name: "4", amount: 2008 },
    { name: "5", amount: 4108 },
    { name: "6", amount: 35008 },
    { name: "7", amount: 478 },
    { name: "8", amount: 3108 },
    { name: "9", amount: 56608 },
    { name: "0", amount: 9808 },
    { name: "J", amount: 1708 },
    { name: "K", amount: 208 },
    { name: "Q", amount: 9108 },
    { name: "A", amount: 11108 },
  ];

  const managers = [
    { id: 1, name: "Amounts", data: { 1: 100, 2: 200, A: 300 } },
  ];

  return (
    <div className="dashboard">
      <h1 className="text-white">Agent Dashboard</h1>
      <div
        className="chart-container d-flex flex-column justify-content-center align-items-center"
        style={{ width: "700px", minWidth: "600px" }}
      >
        <h2>Amount Collected per Number/Alphabet</h2>
        <BarChart width={500} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </div>

      <Betting />
    </div>
  );
};

export default AgentDashboard;
