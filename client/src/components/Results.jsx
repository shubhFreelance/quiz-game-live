import React, { useEffect, useState } from "react";
import { Button, Card, ConfigProvider, Input, Modal, theme } from "antd";
import "../styles/Results.css";
import axios from "axios";

const Results = () => {
  const [sessionData, setSessionData] = useState([]);
  const [result, setResult] = useState("");
  const [sessionStatus, setSessionStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sessionTimings = {
    1: "9:00 AM - 12:00 PM",
    2: "1:00 PM - 4:00 PM",
    3: "5:00 PM - 9:00 PM",
  };

  const sessions = [
    { title: "Session 1", time: "9AM-12PM" },
    { title: "Session 2", time: "1PM-4PM" },
    { title: "Session 3", time: "5PM-9PM" },
  ];

  useEffect(() => {
    fetchSessionStatus();
  }, [sessionStatus]); // Call API whenever sessionStatus changes

  const fetchSessionStatus = () => {
    axios
      .get("/api/session/active")
      .then((res) => {
        console.log("Session Active Data:", res.data);
        setSessionData(res.data);
        setSessionStatus(res.data.status);
      })
      .catch((err) => {
        setSessionStatus("close");
        console.error("Error fetching session data:", err);
      });
  };

  const handleStart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      axios
        .post(
          "/api/session/start",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Agent Data:", res.data);
          // setSessionData(res.data.session);
          console.log("session :", sessionData);
          // alert("data come");
          fetchSessionStatus();
        })
        .catch((err) => {
          // navigate("/login");
          console.log("Error fetching agents:", err);
        });
    }
  };
  const handleChange = (e) => {
    setResult(e.target.value);
  };

  const handleEnd = () => {
    console.log("End Click");
    setIsModalOpen(true);
  };
  const handleDeclare = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      axios
        .post(
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
          console.log("Session Ended Successfully", res.data);
          setIsModalOpen(false);
          setSessionData(null);
          fetchSessionStatus();
        })
        .catch((err) => {
          // navigate("/login");
          console.log("Error Session End:", err);
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="container d-flex justify-content-center gap-3 flex-wrap mt-4  py-4">
        {sessions.map((session, index) => (
          <Card
            key={index}
            className="shadow-sm"
            style={{ width: 250, background: "#333", border: "1px solid #444" }}
          >
            <h5 className="text-white text-center">{session.title}</h5>
            <h6 className="text-white text-center my-3">{session.time}</h6>
            {sessionStatus === "close" ? (
              <Button
                type="primary"
                style={{
                  backgroundColor: "#28a745",
                  borderColor: "#28a745",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#28a745")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
                block
                onClick={handleStart}
              >
                Start
              </Button>
            ) : (
              <>
                <Button
                  color="danger"
                  variant="solid"
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
                      color="danger"
                      variant="solid"
                      block
                      onClick={handleDeclare}
                    >
                      Declare & End
                    </Button>,
                  ]}
                >
                  <h6>Result</h6>
                  <Input
                    name="result"
                    value={result}
                    onChange={handleChange}
                    className="my-3"
                  />
                </Modal>
              </>
            )}
          </Card>
        ))}
      </div>
    </ConfigProvider>
  );
};

export default Results;
