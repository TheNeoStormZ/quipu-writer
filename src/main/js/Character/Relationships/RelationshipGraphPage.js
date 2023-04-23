const React = require("react");
const ReactDOM = require("react-dom/client");
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Navigation from "../../Navigation";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer";
import RelationshipGraph from "./RelationshipGraph";

const theme = createTheme();

function convertirFecha(fechaOriginal) {
  if (fechaOriginal == null) {
    return undefined;
  }
  // Crear objeto Date a partir de la fecha original
  if (fechaOriginal == null) {
    return undefined;
  }
  let fecha = new Date(fechaOriginal);

  // Obtener componentes de la fecha
  let dia = fecha.getDate().toString().padStart(2, "0");
  let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  let anio = fecha.getFullYear().toString();

  // Formatear la fecha en la cadena deseada
  let fechaFormateada = `${anio}-${mes}-${dia}`;

  return fechaFormateada;
}

export default function RelationshipGraphs() {
  const navigate = useNavigate();
  const personajeStr = localStorage.getItem("personaje");
  let personajeTemp = personajeStr;

  const [showGraph, setShowGraph] = React.useState(false);
  const [dataRelations, setDataRelations] = React.useState([]);

  React.useEffect(() => {
    console.log(personajeStr);
    if (personajeStr) {
      personajeTemp = JSON.parse(personajeStr);
      axios
        .get("/api/personajes/relaciones/" + personajeTemp.id + "/detailed")
        .then((response) => {
          setDataRelations(response.data);
          console.log(response.data);
          setShowGraph(true);
        })

        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("FATAL ERROR");
      navigate("/personajes");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>
        <Typography
          component="h3"
          variant="h5"
          align="left"
          color="text.primary"
          sx={{ mt: 2, ml: 2 }}
          gutterBottom
        >
          Grafo de relaciones
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          {showGraph && <RelationshipGraph datos={dataRelations} />}
        </div>
      </main>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </ThemeProvider>
  );
}
