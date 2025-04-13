import React, {useState, useEffect} from "react";
import { useAuth } from "../stores/authContext";
import axios from "axios";
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
import AgentTable from "./AgentTable";
import "../styles/Dashboard.css";

const Dashboard = () => {

  const [agentsData, setAgentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const { user } = useAuth();
  const [barData, setBarData] = useState([])
  const [totalCollection, setTotalCollection] = useState(0);
  // Sample data for Bar Chart



  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };


  //totoal bets in a session for a number
  useEffect(() => {
  const fetchCollectionByNumberForSession = async () => {
    try {
      const sessionRes = await axios.get("/api/session/active");
      console.log("SESSSIONRES",sessionRes.data)
      const { betsByNumber } = sessionRes.data;
  
     
        const chartData = betsByNumber.map((bet) => ({
          name: bet.numberOrAlphabet.toString(),
          amount: bet.totalAmount,
        }));
  
        setBarData(chartData); 
      // setBarData(sessionRes.data.betsByNumber)
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchCollectionByNumberForSession();
}, []);


//Total Collection in a day
useEffect(() => {
  const fetchCollectionForToday= async () => {
    try {
      const response = await axios.get("/api/agent/superadmin/daily-collection", getAuthHeader());
      console.log("Daily Collection",response.data)
      setTotalCollection(response.data.totalDailyCollection);
     
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchCollectionForToday();
}, [])



useEffect(() => {
  const fetchCollectionByNumberForSession = async () => {
    try {
      const sessionRes = await axios.get("/api/session/active");
      console.log("SESSSIONRES",sessionRes.data)
      const { betsByNumber } = sessionRes.data;
  
        // Update the chart data
        const chartData = betsByNumber.map((bet) => ({
          name: bet.numberOrAlphabet.toString(),
          amount: bet.totalAmount,
        }));
  
        setBarData(chartData); 
      // setBarData(sessionRes.data.betsByNumber)
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchCollectionByNumberForSession();
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const sessionRes = await axios.get("/api/session/active");
        setCurrentSession(sessionRes.data);
        console.log("sessionRes",sessionRes.data)
        
        if (!sessionRes.data) {
          throw new Error("No active session found");
        }

        const agentsRes = await axios.get("/api/agent/agents", getAuthHeader());
        const agents = agentsRes.data;
        console.log("agents",agents)

        const performanceData = await Promise.all(
          agents.map(async (agent) => {
            const res = await axios.get(
            
              `/api/agent/${agent._id}/session/${sessionRes.data._id}/bets`
              
            );
            return {
              id: agent._id,
              name: agent.username,
              data: res.data.bets.reduce((acc, bet) => {
                acc[bet.numberOrAlphabet] = bet.amount;
                return acc;
              }, {})
            };
          })
        );
console.log("performanceData",performanceData)
        setAgentsData(performanceData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

 
  const allNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A', 'Joker'];

  if (loading) {
    return <div className="text-white">Loading performance data...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  if (!currentSession) {
    return <div className="text-white">No active session found</div>;
  }
  // Sample data for Pie Chart (total amount collected by each manager)
  // const pieData = [
  //   { name: agent.name, value: 5000 },
  //   { name: "Manager 2", value: 3000 },
  //   { name: "Manager 3", value: 2000 },
  //   { name: "Manager 4", value: 4000 },
  // ];
  const pieData = agentsData.map((agent) => ({name: agent.name, value: Object.values(agent.data).reduce((acc, amount) => acc + amount, 0)}));

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
          <h2>Total amount collected in this session: {currentSession.totalAmountCollected}</h2>
        </div>

        <div className="chart-container">
          <h2>Total Amount Collected by agents in this session-</h2>
          <PieChart width={300} height={300}>
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
        <div className="chart-container">
          <h2>Amount Collected Today-</h2>
          <h2>{totalCollection}</h2>
          </div>
      </div>
      <AgentTable agentsData={agentsData} currentSession={currentSession} />
    </div>
  );
};

export default Dashboard;
