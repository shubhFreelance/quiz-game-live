import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const ContextApi = createContext();

const ContextProvider = ({ children }) => {
  //login information
  const [isloggedin, setisloggedin] = useState(false);

  //login photo
  const [role, setRole] = useState("");

  const value = {
    isloggedin,
    setisloggedin,
    setRole,
    role,
  };

  return <ContextApi.Provider value={value}>{children}</ContextApi.Provider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
