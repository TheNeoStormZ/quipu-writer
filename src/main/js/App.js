const React = require("react");
const ReactDOM = require("react-dom/client");
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CharactersAdd from "./Character/CharacterAdd";
import CharacterInfo from "./Character/CharacterInfo";
import Characters from "./Character/Characters";
import CharacterUpdate from "./Character/CharacterUpdate";
import Index from "./index";
import Login from "./Auth/Login";
import Register from "./Auth/Register";


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
              <Route path="/personajes" element= {<Characters/>} />
              <Route path="/personajes/new" element= {<CharactersAdd/>} />
              <Route path="/personaje/info" element= {<CharacterInfo/>} />
              <Route path="/personaje/update" element= {<CharacterUpdate/>} />
            </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
