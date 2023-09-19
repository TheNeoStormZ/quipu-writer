const React = require("react");
const ReactDOM = require("react-dom/client");
import { BrowserRouter, Route, Routes } from "react-router-dom";

import StoryAdd from "./Story/StoryAdd";
import StoryInfo from "./Story/StoryInfo";
import StoryUpdate from "./Story/StoryUpdate"
import StoryGraph from "./Story/StoryRelationshipsGraphPage"

import StoryArcAdd from "./Story/StoryArc/StoryArcAdd";
import StoryArcInfo from "./Story/StoryArc/StoryArcInfo";
import StoryArcUpdate from "./Story/StoryArc/StoryArcUpdate";

import SceneAdd from "./Story/StoryArc/Scene/SceneAdd";
import SceneInfo from "./Story/StoryArc/Scene/SceneInfo";
import SceneUpdate from "./Story/StoryArc/Scene/SceneUpdate";

import CharactersAdd from "./Character/CharacterAdd";
import CharacterInfo from "./Character/CharacterInfo";
import Characters from "./Character/Characters";
import CharacterUpdate from "./Character/CharacterUpdate";
import RelationshipAdd from "./Character/Relationships/RelationshipAdd";
import RelationshipUpdate from "./Character/Relationships/RelationshipUpdate";
import RelationshipGraphs from "./Character/Relationships/RelationshipGraphPage";

import UserInfo from "./User/UserInfo";
import UserUpdate from "./User/UserUpdate";

import Index from "./index";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

export default function App() {

  if (localStorage.getItem("darkMode") == null){
    localStorage.setItem("darkMode",JSON.stringify(false));
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
                <Route path="/personaje/relaciones/add" element= {<RelationshipAdd/>} />
                <Route path="/personaje/relaciones/update" element= {<RelationshipUpdate/>} />
                <Route path="/personaje/relaciones/graph" element= {<RelationshipGraphs/>} />

              <Route path="/historias/new" element= {<StoryAdd/>} />
              <Route path="/historia/info" element= {<StoryInfo/>} />
              <Route path="/historia/update" element= {<StoryUpdate/>} />
              <Route path="/historia/graph" element= {<StoryGraph/>} />

                <Route path="/historia/tramas/add" element= {<StoryArcAdd/>} />
                <Route path="/historia/trama/info" element= {<StoryArcInfo/>} />
                <Route path="/historia/trama/update" element= {<StoryArcUpdate/>} />

                  <Route path="/historia/trama/escenas/add" element= {<SceneAdd/>} />
                  <Route path="/historia/trama/escena/info" element= {<SceneInfo/>} />
                  <Route path="/historia/trama/escena/update" element= {<SceneUpdate/>} />

              <Route path="/usuario/info" element= {<UserInfo/>} />
              <Route path="/usuario/update" element= {<UserUpdate/>} />
            </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
