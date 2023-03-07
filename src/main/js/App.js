const React = require("react");
const ReactDOM = require("react-dom/client");
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CharactersAdd from "./CharacterAdd";
import CharacterInfo from "./CharacterInfo";
import Characters from "./Characters";
import CharacterUpdate from "./CharacterUpdate";


import StoryAdd from "./Story/StoryAdd";
import StoryInfo from "./Story/StoryInfo";
import StoryUpdate from "./Story/StoryUpdate"

import Index from "./index";
import Login from "./Login";
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
              <Route path="/personajes" element= {<Characters/>} />
              <Route path="/personajes/new" element= {<CharactersAdd/>} />
              <Route path="/personaje/info" element= {<CharacterInfo/>} />
              <Route path="/personaje/update" element= {<CharacterUpdate/>} />
              <Route path="/historias/new" element= {<StoryAdd/>} />
              <Route path="/historia/info" element= {<StoryInfo/>} />
              <Route path="/historia/update" element= {<StoryUpdate/>} />
            </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
