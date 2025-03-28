import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ContextProvieder } from "./stores/ContextApi.jsx";
// import './index.css'

import App from "./App.jsx";
import  { AuthProvider } from "./stores/authContext.jsx";
import "@ant-design/v5-patch-for-react-19";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
