import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";

// import axios from "axios";

const Betting = ({ agentId, sessionId, sessionStatus, fetchAmount }) => {
  const [rows, setRows] = useState([
    { id: 1, value: "", apiUrl: "https://api.example.com/submit1" },
    { id: 2, value: "", apiUrl: "https://api.example.com/submit2" },
    { id: 3, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 4, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 5, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 6, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 7, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 8, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 9, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: 0, value: "", apiUrl: "https://api.example.com/submit3" },
    { id: "J", value: "", apiUrl: "https://api.example.com/submit3" },
    { id: "K", value: "", apiUrl: "https://api.example.com/submit3" },
    { id: "Q", value: "", apiUrl: "https://api.example.com/submit3" },
    { id: "A", value: "", apiUrl: "https://api.example.com/submit3" },
  ]);

  const handleChange = (id, newValue) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, value: newValue } : row))
    );
  };

  // console.log("Betting :", agentId, sessionId, sessionStatus);

  const handleSubmit = async (id) => {
    const row = rows.find((row) => row.id === id);
    if (!row.value.trim()) {
      alert("Input cannot be empty!");
      return;
    } else {
      const numberOrAlphabet = row.id;
      const amount = row.value;
      axios
        .post("/api/bet/bet", {
          agentId,
          numberOrAlphabet,
          amount,
          sessionId,
        })
        .then((res) => {
          console.log("Successfull bet:", res.data);
          fetchAmount();
          // setSessionData(res.data);
          // setSessionStatus(res.data.status);
        })
        .catch((err) => {
          console.error("Error Betting:", err);
        });
    }
    // console.log(row.value);
  };

  return (
    <div className="manager-tables">
      <div className="manager-table">
        <h3 className="text-white">Amounts Collected</h3>
        <table className="text-white" width="80%">
          <thead>
            <tr>
              <th>Numbers/Alphabets</th>
              <th className="text-center">Amounts Collected</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="w-25">{row.id}</td>
                <td className="text-center">
                  <Input
                    className="custom-input text-dark text-center w-50"
                    type="number"
                    value={row.value}
                    onChange={(e) => handleChange(row.id, e.target.value)}
                    placeholder="Enter data"
                    disabled={sessionStatus === "close"}
                  />
                </td>
                <td className="w-25">
                  <Button
                    type="primary"
                    disabled={sessionStatus === "close"}
                    onClick={() => handleSubmit(row.id)}
                  >
                    Submit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Betting;
