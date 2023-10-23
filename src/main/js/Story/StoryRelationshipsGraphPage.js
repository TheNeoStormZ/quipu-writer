const React = require("react");
const ReactDOM = require("react-dom/client");
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import RelationshipGraph from "./RelationshipGraph";
import Box from "@mui/material/Box";

import createDarkTheme from "../theme";
const theme = createDarkTheme(JSON.parse(localStorage.getItem("darkMode")) === true);

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
  const historiaStr = localStorage.getItem("historia");
  let historiaTemp = historiaStr;

  const [showGraph, setShowGraph] = React.useState(false);
  const [dataRelations, setDataRelations] = React.useState([]);

  React.useEffect(() => {
    console.log(historiaStr);
    if (historiaStr) {
      historiaTemp = JSON.parse(historiaStr);
      axios
        .get("/api/historia/relaciones/" + historiaTemp.id + "/detailed")
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
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          width: "80%",
          boxShadow: 24,
          p: 4,
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflowY: "auto",
        }}
        >
          {" "}
          {showGraph && <RelationshipGraph datos={dataRelations} />}
        </Box>
      </main>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </ThemeProvider>
  );
}
