// import { Tooltip } from "antd";
// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { BarChart, Bar, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
// import "../styles/Dashboard.css";
// import Betting from "./Betting";
// import axios from "axios";
// import { useAuth} from "../stores/authContext";

// const AgentDashboard = () => {
//   const navigate = useNavigate();
//   const barData = [
//     { name: "1", amount: 2400 },
//     { name: "2", amount: 1398 },
//     { name: "3", amount: 9800 },
//     { name: "4", amount: 2008 },
//     { name: "5", amount: 4108 },
//     { name: "6", amount: 35008 },
//     { name: "7", amount: 478 },
//     { name: "8", amount: 3108 },
//     { name: "9", amount: 56608 },
//     { name: "0", amount: 9808 },
//     { name: "J", amount: 1708 },
//     { name: "K", amount: 208 },
//     { name: "Q", amount: 9108 },
//     { name: "A", amount: 11108 },
//   ];
//   const [sessionStatus, setSessionStatus] = useState("");
//   const [agentId, setAgentId] = useState("");
//   const [sessionData, setSessionData] = useState([]);
//   const [amount, setAmount] = useState("");

//   const { setIsloggedin, isLoggedIn, role } = useAuth()

//   useEffect(() => {
//     fetchSessionId();
//     // fetchAgentId();
//     // fetchAmount();
//   }, [sessionStatus]); // Call API whenever sessionStatus changes

//   useEffect(() => {
//     fetchAgentId();
//   }, [agentId]);

//   //For Fetching Session Id
//   const fetchSessionId = () => {
//     axios
//       .get("/api/session/active")
//       .then((res) => {
//         // console.log("Session Active Data:", res.data);
//         setSessionData(res.data);
//         setSessionStatus(res.data.status);
//       })
//       .catch((err) => {
//         setSessionStatus("close");
//         // console.log("Noo");

//         console.error("Error fetching session data:", err);
//       });
//   };

//   //For Fetching AgentId
//   const fetchAgentId = () => {
//     const token = localStorage.getItem("token");
//     console.log("Token", token);
//     if (!token) {
//       navigate("/");
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
//           setAgentId(res.data.agentId);
//           // setSessionStatus(res.data.status);
//         })
//         .catch((err) => {
//           // setSessionStatus("close");
//           console.error("Error fetching Agent Id:", err);
//         });
//     }
//   };

//   const handleLogOut = () => {
//     localStorage.removeItem("token");
//     setIsloggedin(false);
//     navigate("/");
//   };

//   //For Amount Collected in a session by Agent

//   useEffect(() => {
//     if (agentId && sessionData?._id) {
//       fetchAmount();
//     }
//   }, [agentId, sessionData?._id]);

//   const fetchAmount = () => {
//     axios
//       .get(`/api/agent/${agentId}/session/${sessionData._id}`)
//       .then((res) => {
//         console.log("Session Amount:", res.data);
//         setAmount(res.data.amount);
//       })
//       .catch((err) => {
//         console.error("Error fetching session data:", err);
//       });
//   };

//   const managers = [
//     { id: 1, name: "Amounts", data: { 1: 100, 2: 200, A: 300 } },
//   ];

//   return (
//     <div className="dashboard text-white ">
//       <div className="d-flex flex-row align-items-center gap-5 justify-content-flex-end ">
     
//       <h1 className="">Agent Dashboard</h1>
//       <button className="logout-btn" onClick={handleLogOut}>
//           Logout
//         </button>
         
//       </div>
//       <div
//         className="d-flex w-100 gap-3 flex-row justify-content-center "
//         style={{ width: "700px", minWidth: "600px" }}
//       >
//         <div className="chart-container">
//           <h2>Amount Collected per Number/Alphabet</h2>
//           <BarChart width={500} height={300} data={barData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="amount" fill="#8884d8" />
//           </BarChart>
//         </div>
//         <div className="chart-container ">
//           <h2>Total Amounts Collected in a Session</h2>
//           <h1>{amount}</h1>
//         </div>
//       </div>

//       <Betting
//         agentId={agentId}
//         sessionId={sessionData._id}
//         sessionStatus={sessionStatus}
//         fetchAmount={fetchAmount}
//       />
//     </div>
//   );
// };

// export default AgentDashboard;


// import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from "recharts";
import "../styles/Dashboard.css";
import Betting from "./Betting";
import axios from "axios";
import { useAuth } from "../stores/authContext";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  

  const [sessionStatus, setSessionStatus] = useState("");
  const [agent, setAgent] = useState({});
  const [sessionData, setSessionData] = useState({});
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [barData, setBarData] = useState([]);

  console.log("Agentid",agent.userId)

  useEffect(() => {
    const fetchAgentBets = async () => {
      try {
        const response = await axios.get(`/api/agent/${agent.userId}/current-session-bets`);
        const { bets } = response.data;
  
        // Update the chart data
        const chartData = bets.map((bet) => ({
          name: bet.numberOrAlphabet.toString(),
          amount: bet.amount,
        }));
  
        setBarData(chartData); 
      } catch (error) {
        console.error("Error fetching agent bets:", error);
      }
    };
  
    if (agent.userId) {
      fetchAgentBets();
    }
  }, [agent.userId, amount]);

  // Fetch session data and agent ID on component mount
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/"); 
    } else {
      fetchSessionId();
      fetchAgentId();
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch session data whenever sessionStatus changes
  useEffect(() => {
    if (sessionStatus === "open") {
      fetchAmount();
    }
  }, [sessionStatus, agent, sessionData?._id]);

  // Fetch active session ID
  const fetchSessionId = async () => {
    try {
      const response = await axios.get("/api/session/active");
      setSessionData(response.data);
      setSessionStatus(response.data.status);
    } catch (error) {
      setSessionStatus("close");
      console.error("Error fetching session data:", error);
    }
  };
  console.log("sessionData",sessionData)

  // Fetch agent ID
  const fetchAgentId = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get("/api/auth/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  console.log("response",response.data)
      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching agent ID:", error);
    }
  };

  // Fetch amount collected by the agent in the current session
  const fetchAmount = async () => {
    try {
      const response = await axios.get(`/api/agent/${agent.userId}/session/${sessionData._id}`);
      console.log("Amount Collected in a session by Agent:", response)
      setAmount(response.data.amount);
    } catch (error) {
      console.error("Error fetching session amount:", error);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    isAuthenticated && (
      <div className="dashboard text-white">
        <div className="d-flex flex-row align-items-center gap-5 justify-content-flex-end">
          <h1>Agent Dashboard</h1>
        </div>

        <div className="d-flex w-100 gap-3 flex-row justify-content-center" style={{ width: "700px", minWidth: "600px" }}>
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
            <h2>Total Amounts Collected in a Session | <span style={{fontSize:"0.8rem"}}> Current Session Number-{sessionData.sessionNumber}</span></h2>
            <h1>{amount}</h1>
          </div>
        </div>

        <Betting
          agentId={agent.userId}
          sessionId={sessionData._id}
          sessionStatus={sessionStatus}
          fetchAmount={fetchAmount}
        />
      </div>
    )
  );
};

export default AgentDashboard;