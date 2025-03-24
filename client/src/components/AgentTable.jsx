import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { useAuth } from "../stores/authContext";

const AgentTable = ({agentsData, currentSession}) => {
//   const [agentsData, setAgentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentSession, setCurrentSession] = useState(null);
//   const { user } = useAuth();

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
      
//         const sessionRes = await axios.get("/api/session/active");
//         setCurrentSession(sessionRes.data);
//         console.log("sessionRes",sessionRes.data)
        
//         if (!sessionRes.data) {
//           throw new Error("No active session found");
//         }

//         const agentsRes = await axios.get("/api/agent/agents", getAuthHeader());
//         const agents = agentsRes.data;
//         console.log("agents",agents)

//         const performanceData = await Promise.all(
//           agents.map(async (agent) => {
//             const res = await axios.get(
            
//               `/api/agent/${agent._id}/session/${sessionRes.data._id}/bets`
              
//             );
//             return {
//               id: agent._id,
//               name: agent.username,
//               data: res.data.bets.reduce((acc, bet) => {
//                 acc[bet.numberOrAlphabet] = bet.amount;
//                 return acc;
//               }, {})
//             };
//           })
//         );
// console.log("performanceData",performanceData)
//         setAgentsData(performanceData);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

  const allNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A', 'Joker'];

//   if (loading) {
//     return <div className="text-white">Loading performance data...</div>;
//   }

//   if (error) {
//     return <div className="text-white">Error: {error}</div>;
//   }

//   if (!currentSession) {
//     return <div className="text-white">No active session found</div>;
//   }

  return (
    <div className="manager-tables-container ">
      <h2 className="text-white">Current Session: {currentSession.sessionNumber}</h2>
      
      {agentsData.map((agent) => (
        console.log("agent",agent),
        <div key={agent.id} className="manager-table-wrapper"  style={{marginTop: "20px"}}>
          <h3 className="text-white">{agent.name.toUpperCase()}'s Performance</h3>
          <table className="performance-table text-white">
            <thead>
              <tr>
                <th>Number/Alphabet</th>
                {allNumbers.map(num => (
                  <th key={num}>{num}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amount Collected</td>
                {allNumbers.map(num => (
                  <td key={num}>{agent.data[num] || 0}</td>
                ))}
                <td>
                  {Object.values(agent.data).reduce((sum, amount) => sum + amount, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AgentTable;