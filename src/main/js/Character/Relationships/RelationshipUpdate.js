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
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer";

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
  // Crear objeto Date a partir de la fecha original
  if (fechaOriginal == null){
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
        .put("/api/personajes/relaciones/update", {
          id: relacion.id,
          fecha: data.get("fecha"),
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


  const [relacion, setRelacion] = React.useState([]);

  const [personajesUsuario, setPersonajesUsuarios] = React.useState([]);

  const relacionStr = localStorage.getItem("relacion");
  let relacionTemp = relacionStr;

  React.useEffect(() => {
    if (relacionStr) {
      relacionTemp = JSON.parse(relacionStr);
      setRelacion(relacionTemp);
      console.log(relacionTemp.personajesInvolucrados);
      setSelectedCharacters(relacionTemp.personajesInvolucrados);
      getPersonajesUusario(relacionTemp.id);
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


  function handleTextChange(e) {
    setRelacion({ ...relacion, [e.target.name]: e.target.value });
    console.log(relacion);
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
          Actualizar relación
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
                  name="fecha"
                  value={convertirFecha(relacion.fecha) || ''}
                  onChange={handleTextChange}
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
                  value={selectedCharacters}
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
                  value={relacion.descripcion || ''}
                  onChange={handleTextChange}
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
                  Actualizar relacion
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
