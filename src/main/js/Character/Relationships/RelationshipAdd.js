const React = require("react");
const ReactDOM = require("react-dom/client");
import EventIcon from "@mui/icons-material/Event";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../../Navigation";

import axios from "axios";
import Footer from "../../Footer";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

let alertMessage = "";
const AlertCustom = ({ showAlert }) => {
  if (!showAlert) {
    return null;
  }

  return (
    <Alert variant="outlined" severity="error" sx={{ m: 2}}>
      {alertMessage}
    </Alert>
  );
};


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

export default function Relationship() {

  const navigate = useNavigate();

  const [selectedCharacters, setSelectedCharacters] = React.useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .post("/api/personajes/relaciones/add/" + personaje.id, {
          fecha: data.get("fechaRelacion"),
          personajesInvolucrados: selectedCharacters,
          descripcion: data.get("descripcion"),
        })
        .then(navigate("/personaje/info"));
    } catch (err) {
      console.log(err);
      let message = err.response.data;
      alertMessage = message;
      setShowAlert(true);
    }
  };
  const [showAlert, setShowAlert] = React.useState(false);


  const [personaje, setPersonaje] = React.useState([]);

  const [personajesUsuario, setPersonajesUsuarios] = React.useState([]);

  const personajeStr = localStorage.getItem("personaje");
  let personajeTemp = personajeStr;


  React.useEffect(() => {
    if (personajeStr) {
      personajeTemp = JSON.parse(personajeStr);
      setPersonaje(personajeTemp);
      getPersonajesUusario(personajeTemp.id);
    } else {
      console.log("FATAL ERROR");
      navigate("/personajes");
    }
  }, []);

  function getPersonajesUusario(id) {
    axios
      .get("/api/personajes/" + id)
      .then((response) => setPersonajesUsuarios(response.data))
      .catch((error) => console.log(error));
  }





  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>
        <Typography
          sx={{ mt: 2, ml: 2 }}
          component="h1"
          variant="h4"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Añadir relación para {personaje.nombre}
        </Typography>
        <AlertCustom showAlert={showAlert} />
        <Box
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <div>
                <TextField
                  id="outlined-required"
                  label="Fecha de la relacion"
                  type="date"
                  name="fechaRelacion"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <Autocomplete
                  options={personajesUsuario}
                  getOptionLabel={(personaje) => personaje.nombre}
                  id="auto-select"
                  autoSelect
                  onChange={(event, value) => setSelectedCharacters(value)}
                  multiple
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Relaciones"
                      variant="standard"
                      name="personajesRelacionados"
                    />
                  )}
                />

                <TextField
                  fullWidth
                  id="outlined-textarea"
                  label="Descripción"
                  name="descripcion"
                  multiline
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<SaveAsIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Añadir relacion
              </Button>
            </Box>
          </div>
        </Box>
      </main>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </ThemeProvider>
  );
}
