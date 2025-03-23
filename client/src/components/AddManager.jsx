import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { Button, Input, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const AddManager = () => {
  const [agents, setAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [password, setPassword] = useState(""); // Store new password input
  const navigate = useNavigate();

  const showMessage = (type, content) => {
    message[type]({
      content,
      duration: 3,
      className: "custom-message",
      style: {
        color: "black",
      },
    });
  };

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      } else {
        axios
          .get("/api/agent/agents", {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            console.log("Agent Data:", res.data);
            setAgents(res.data);
          })
          .catch((err) => {
            navigate("/login");
            console.log("Error fetching agents:", err);
          });
      }
    };
    getData();
  }, []);

  // Open modal and set selected agent ID
  const showPasswordModal = (agentId, agent) => {
    setSelectedAgentId(agentId);
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setPassword(""); // Clear password input
  };

  // Submit password update
  const handleUpdatePassword = async () => {
    if (!password) {
      alert("Please enter a new password.");
      return;
    }
    console.log("pss :", selectedAgentId, password, selectedAgent);
    const username = selectedAgent;
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `/api/agent/agent/${selectedAgentId}`,
        { username, password },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      showMessage(
        "success",
        `Password for Agent: ${selectedAgent} changed successfully!`
      );
      handleCancel(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating password:", error);
      showMessage("error", "Login Successful");
    }
  };

  return (
    <div className="add-manager text-white">
      <h1>Credential Management</h1>

      <div className="credential-list mt-4">
        <h5>Agent Credentials</h5>
        <div className="manager-table">
          <table className="mt-4">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent._id}>
                  <td>{agent._id}</td>
                  <td>{agent.username}</td>
                  <td>
                    <Button
                      onClick={() =>
                        showPasswordModal(agent._id, agent.username)
                      }
                    >
                      Update Password
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Update Modal */}
      <Modal
        title="Update Password"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button color="danger" variant="solid" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
            onClick={handleUpdatePassword}
          >
            Update Password
          </Button>,
        ]}
      >
        <Input.Password
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="my-3 text-dark"
        />
      </Modal>
    </div>
  );
};

export default AddManager;
