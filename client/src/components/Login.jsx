// import { Button, Input, message, Select, ConfigProvider } from "antd";
// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ContextApi } from "../stores/authContext";
// import "../styles/Dashboard.css";
// import axios from "axios";
// // import bgShape from "../assets/bgshape.svg";
// import bgblur from "../assets/bgblur.svg";

// const Login = () => {
//   const { setisloggedin, setRole, role } = useContext(ContextApi);
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     username: "",
//     password: "",
//   });

//   const showMessage = (type, content) => {
//     message[type]({
//       content,
//       duration: 3,
//       className: "custom-message",
//       style: {
//         color: "black",
//       },
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (value) => {
//     setRole(value);
//   };

//   const handleLogin = () => {
//     if (!data.username || !data.password) {
//       showMessage("error", "Username and password are incorrect");
//     } else {
//       console.log("data :", data);

//       axios
//         .post("/api/auth/login", data)
//         .then((res) => {
//           showMessage("success", "Login Successful");
//           localStorage.setItem("token", res.data.token);
//           // navigate("/profile");
//           if (role === "superadmin") {
//             navigate("/dashboard");
//           } else {
//             navigate("/agent");
//           }
//           setisloggedin(true);
//           setData({
//             email: "",
//             password: "",
//           });
//         })
//         .catch((err) => {
//           showMessage("error", err.response.data.message);
//           console.log(err);
//         });

//       // setisloggedin(true);
//     }
//   };

//   return (
//     <ConfigProvider theme={{ mode: "dark" }}>
//       <div
//         className="w-100 d-flex justify-content-center align-items-center position-relative"
//         style={{ height: "100vh" }}
//       >
//         <img
//           src={bgblur}
//           alt="Background shape"
//           style={{
//             position: "absolute",
//             zIndex: 0,
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//           }}
//         />
//         <div
//           className="d-flex justify-content-center rounded-4 flex-column align-items-center gap-3 p-5 position-relative glass-effect"
//           style={{
//             minWidth: "350px",
//             width: "500px",
//             zIndex: 1,
//           }}
//         >
//           <h1 className="text-white">Login</h1>

//           <Select
//             className="custom-select w-100 text-black text-center"
//             value={data.role || undefined}
//             placeholder="Select Role"
//             onChange={handleSelectChange}
//           >
//             <Select.Option value="superadmin">Superadmin</Select.Option>
//             <Select.Option value="agent">Agent</Select.Option>
//           </Select>

//           <Input
//             className="custom-input text-dark text-center"
//             type="text"
//             id="username"
//             name="username"
//             value={data.username}
//             onChange={handleChange}
//             placeholder="Username"
//             required
//           />

//           <Input
//             className="custom-input text-dark text-center"
//             type="password"
//             id="password"
//             name="password"
//             value={data.password}
//             onChange={handleChange}
//             placeholder="Password"
//             required
//             // style={{
//             //   backgroundColor: "#1f1f1f",
//             //   borderColor: "#434343",
//             // }}
//           />

//           <div className="d-flex gap-2">
//             <Button type="primary" onClick={handleLogin}>
//               Login!
//             </Button>
//           </div>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../stores/authContext";
import { ConfigProvider, Input, Button, message, Spin } from "antd";
import axios from "axios";
import bgblur from "../assets/bgblur.svg";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth(); // Add loading state from AuthContext

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

  const handleLogin = async () => {
    const { username, password } = data;

    if (!username || !password) {
      showMessage("error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", { username, password });
      const { token, userId, userRole } = response.data;

      localStorage.setItem("token", token);

      // Update auth context
      login({ userId, role: userRole });

      if (userRole === "superadmin") {
        navigate("/dashboard");
      } else if (userRole === "agent") {
        navigate("/agent");
      }

      // Clear form data
      setData({
        username: "",
        password: "",
      });

      showMessage("success", "Login successful!");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Or redirect based on user role
    }
  }, [isAuthenticated, navigate]);

  // Show loading spinner while AuthContext is validating the token
  if (loading) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

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