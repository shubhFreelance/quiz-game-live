import React, { useEffect, useState } from "react";
import { Button, Card, ConfigProvider, Input, Modal, theme, message } from "antd";
import "../styles/Results.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [result, setResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [declaredResult, setDeclaredResult] = useState("");
  
  const sessions = [
    { id: 1, title: "Session 1", time: "9AM-12PM" },
    { id: 2, title: "Session 2", time: "1PM-4PM" },
    { id: 3, title: "Session 3", time: "5PM-9PM" },
  ];

  useEffect(() => {
    fetchSessionStatus();
  }, []);

  const fetchSessionStatus = () => {
    axios
      .get("/api/session/active")
      .then((res) => {
        setSessionData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching session data:", err);
        setSessionData(null);
      });
  };

  const handleStart = (sessionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      axios
        .post(
          "/api/session/start",
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          fetchSessionStatus();
          message.success("Session started successfully!");
        })
        .catch((err) => {
          message.error("Error starting session");
          console.log("Error starting session:", err);
        });
    }
  };

  const handleChange = (e) => {
    setResult(e.target.value);
  };

  const handleEnd = () => {
    setIsModalOpen(true);
  };

  const handleDeclare = () => {
    if (!result) {
      message.error("Please enter a result before declaring");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios.post(
      "/api/session/end",
      { result },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      setDeclaredResult(result);
      setIsModalOpen(false);
      setIsResultModalOpen(true);
      setResult("");
      fetchSessionStatus();
      message.success("Result declared successfully!");
    })
    .catch((err) => {
      message.error("Error declaring result");
      console.log("Error ending session:", err);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleResultModalClose = () => {
    setIsResultModalOpen(false);
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="container d-flex justify-content-center gap-3 flex-wrap mt-4 py-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="shadow-sm"
            style={{ width: 250, background: "#333", border: "1px solid #444" }}
          >
            <h5 className="text-white text-center">{session.title}</h5>
            <h6 className="text-white text-center my-3">{session.time}</h6>
            
            {sessionData?.sessionNumber === session.id ? (
              <>
                <Button
                  type="primary"
                  danger
                  block
                  onClick={handleEnd}
                >
                  End
                </Button>
                <Modal
                  open={isModalOpen}
                  onCancel={handleCancel}
                  footer={[
                    <Button
                      key="submit"
                      type="primary"
                      danger
                      block
                      onClick={handleDeclare}
                    >
                      Declare & End
                    </Button>,
                  ]}
                >
                  <h6 className="text-white">Enter Result</h6>
                  <Input
                    name="result"
                    value={result}
                    onChange={handleChange}
                    className="my-3"
                    placeholder="Enter the winning number/alphabet"
                  />
                </Modal>
              </>
            ) : (
              <Button
                type="primary"
                style={{
                  backgroundColor: "#28a745",
                  borderColor: "#28a745",
                }}
                block
                onClick={() => handleStart(session.id)}
              >
                Start
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Big Result Announcement Modal */}
      <Modal
        title={<span style={{ color: 'white', fontSize: '20px' }}>🎉 RESULT ANNOUNCEMENT 🎉</span>}
        visible={isResultModalOpen}
        onCancel={handleResultModalClose}
        footer={null}
        width={600}
        centered
        bodyStyle={{ 
          backgroundColor: '#1f1f1f', 
          padding: '40px',
          textAlign: 'center'
        }}
      >
        <div style={{ margin: '20px 0' }}>
          <p style={{ color: 'white', fontSize: '18px', marginBottom: '10px' }}>The winning number is:</p>
          <div style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#52c41a',
            margin: '30px 0',
            textShadow: '0 0 10px rgba(82, 196, 26, 0.7)'
          }}>
            {declaredResult}
          </div>
          <p style={{ color: '#aaa', fontStyle: 'italic' }}>Session successfully closed</p>
        </div>
        <Button 
          type="primary" 
          size="large"
          onClick={handleResultModalClose}
          style={{ 
            width: '150px',
            height: '40px',
            marginTop: '20px'
          }}
        >
          OK
        </Button>
      </Modal>
    </ConfigProvider>
  );
};

export default Results;