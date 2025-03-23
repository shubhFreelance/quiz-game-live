import { Button, Input } from "antd";
import React, { useState } from "react";
import "../styles/Dashboard.css";

// import axios from "axios";

const Betting = () => {
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

  const handleSubmit = async (id) => {
    const row = rows.find((row) => row.id === id);
    if (!row.value.trim()) {
      alert("Input cannot be empty!");
      return;
    }
    console.log(row.value);

    // try {
    //   const response = await axios.post(row.apiUrl, { data: row.value });
    //   alert(`Success: ${response.data.message}`);
    // } catch (error) {
    //   alert(`Error: ${error.response?.data?.message || error.message}`);
    // }
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
                  />
                </td>
                <td className="w-25">
                  <Button type="primary" onClick={() => handleSubmit(row.id)}>
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
