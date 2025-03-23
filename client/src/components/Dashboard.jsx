import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ManagerTable from "./ManagerTable";
import "../styles/Dashboard.css";

const Dashboard = () => {
  // Sample data for Bar Chart
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

  // Sample data for Pie Chart (total amount collected by each manager)
  const pieData = [
    { name: "Manager 1", value: 5000 },
    { name: "Manager 2", value: 3000 },
    { name: "Manager 3", value: 2000 },
    { name: "Manager 4", value: 4000 },
  ];

  // Colors for the Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard">
      <h1 className="text-white">Admin Dashboard</h1>
      <div className="charts-container">
        <div className="chart-container">
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

        <div className="chart-container">
          <h2>Total Amount Collected by Managers</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
      <ManagerTable />
    </div>
  );
};

export default Dashboard;
