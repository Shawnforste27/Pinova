import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/AuthContext";
import { PinProvider } from "./context/PinContext";
import axios from "axios";

// ✅ Configure axios for cookies + proxy
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <PinProvider>
        <App />
      </PinProvider>
    </UserProvider>
  </React.StrictMode>
);
