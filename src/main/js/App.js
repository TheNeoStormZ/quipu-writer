const React = require("react");
const ReactDOM = require("react-dom/client");
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Index from "./index";
import Login from "./Login";
import theme from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";



export default function App() {

  const token = localStorage.getItem("token");
  if (token) {
      setAuthToken(token);
  }

  return (
    <BrowserRouter>
            <Routes >
             <Route path="/" element= {<Index/>} />
              <Route path="/login" element= {<Login/>} />
              <Route path="/register" element= {<Register/>} />
            </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
