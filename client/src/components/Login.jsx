import { Button, Input, message, Select, ConfigProvider } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextApi } from "../stores/ContextApi";
import "../styles/Dashboard.css";
import axios from "axios";
// import bgShape from "../assets/bgshape.svg";
import bgblur from "../assets/bgblur.svg";

const Login = () => {
  const { setisloggedin, setRole, role } = useContext(ContextApi);
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setRole(value);
  };

  const handleLogin = () => {
    if (!data.username || !data.password) {
      showMessage("error", "Username and password are incorrect");
    } else {
      console.log("data :", data);

      axios
        .post("/api/auth/login", data)
        .then((res) => {
          showMessage("success", "Login Successful");
          localStorage.setItem("token", res.data.token);
          // navigate("/profile");
          if (role === "superadmin") {
            navigate("/dashboard");
          } else {
            navigate("/agent");
          }
          setisloggedin(true);
          setData({
            email: "",
            password: "",
          });
        })
        .catch((err) => {
          showMessage("warning", "Please fill all the fields");
          console.log(err);
        });

      // setisloggedin(true);
    }
  };

  return (
    <ConfigProvider theme={{ mode: "dark" }}>
      <div
        className="w-100 d-flex justify-content-center align-items-center position-relative"
        style={{ height: "100vh" }}
      >
        <img
          src={bgblur}
          alt="Background shape"
          style={{
            position: "absolute",
            zIndex: 0,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          className="d-flex justify-content-center rounded-4 flex-column align-items-center gap-3 p-5 position-relative glass-effect"
          style={{
            minWidth: "350px",
            width: "500px",
            zIndex: 1,
          }}
        >
          <h1 className="text-white">Login</h1>

          <Select
            className="custom-select w-100 text-black text-center"
            value={data.role || undefined}
            placeholder="Select Role"
            onChange={handleSelectChange}
          >
            <Select.Option value="superadmin">Superadmin</Select.Option>
            <Select.Option value="agent">Agent</Select.Option>
          </Select>

          <Input
            className="custom-input text-dark text-center"
            type="text"
            id="username"
            name="username"
            value={data.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />

          <Input
            className="custom-input text-dark text-center"
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Password"
            required
            // style={{
            //   backgroundColor: "#1f1f1f",
            //   borderColor: "#434343",
            // }}
          />

          <div className="d-flex gap-2">
            <Button type="primary" onClick={handleLogin}>
              Login!
            </Button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;
