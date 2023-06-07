const React = require("react");
const ReactDOM = require("react-dom/client");
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import EventIcon from "@mui/icons-material/Event";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation";
import Alert from "@mui/material/Alert";

import axios from "axios";
import Footer from "../Footer";


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
  if (fechaOriginal == null){
    return undefined;
  }
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

export default function Update() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .put("/api/personajes/update", {
          id: personaje.id,
          nombre: data.get("nombre"),
          primerApellido: data.get("primerApellido"),
          segundoApellido: data.get("segundoApellido"),
          fechaNacimiento: data.get("fechaNacimiento"),
          lugarNacimiento: data.get("lugarNacimiento"),
          altura: data.get("altura"),
          residencia: data.get("residencia"),
          descripcion: data.get("descripcion"),
          genero: data.get("genero"),
          urlIcon: data.get("urlIcon"),
        })
        .then(() => {
          window.location.href = "/personajes";
        });
    } catch (err) {
      console.log(err);
      let message = err.response.data;
      alertMessage = message;
      setShowAlert(true);
    }
  };
  const [showAlert, setShowAlert] = React.useState(false);


  const [genders, setGenders] = React.useState([]);
  const [personaje, setPersonaje] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/personajes/generos")
      .then((response) => setGenders(response.data))
      .catch((error) => console.log(error));
  }, []);

  const personajeStr = localStorage.getItem("personaje");
  let personajeTemp = personajeStr;
  const [avatarUrl, setAvatarUrl] = React.useState("");

  React.useEffect(() => {
    if (personajeStr) {
      personajeTemp = JSON.parse(personajeStr);
      setPersonaje(personajeTemp);
      console.log(personajeTemp);
    } else {
      console.log("FATAL ERROR");
      navigate("/personajes");
    }
  }, []);


  const handleAvatarUrlChange = (event) => {
    setPersonaje({...personaje, [event.target.name]: event.target.value});
    setAvatarUrl(event.target.value);
  };

  function handleTextChange(e) {
    setPersonaje({...personaje, [e.target.name]: e.target.value});
    console.log(personaje)
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
          Actualizar personaje
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
                <Avatar
                  alt="Avatar"
                  src={avatarUrl}
                  sx={{ width: 56, height: 56 }}
                />
              </div>
              <div>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Datos basicos
                </Typography>

                <TextField
                  required
                  id="outlined-required"
                  label="Nombre"
                  name="nombre"
                  value={personaje.nombre || ''}
                  onChange={handleTextChange}
                />
                <TextField
                  id="outlined-required"
                  label="Apellido 1"
                  name="primerApellido"
                  value={personaje.primerApellido || ''}
                  onChange={handleTextChange}
                />
              </div>
              <div>
                <TextField
                  id="outlined-required"
                  label="Apellido 2"
                  name="segundoApellido"
                  value={personaje.segundoApellido || ''}
                  onChange={handleTextChange}
                />
                <TextField
                  id="outlined-required"
                  label="Residencia"
                  name="residencia"
                  value={personaje.residencia || ''}
                  onChange={handleTextChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Características del personaje
                </Typography>
                <TextField
                  id="outlined-required"
                  label="Altura"
                  type="number"
                  name="altura"
                  value={personaje.altura || ''}
                  onBlur={(e) => {
                    if (Number(e.target.value) < 0) {
                      setPersonaje({...personaje, [e.target.name]: 0});; // Si el valor es menor que 0, se cambia a 0
                    }
                   }}
                  onChange={handleTextChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">cm</InputAdornment>
                    ),
                    inputProps: { min: 0 },
                  }}
                />
                <TextField
                  id="outlined"
                  label="URL icono"
                  name="urlIcon"
                  onChange={handleAvatarUrlChange}
                  value={personaje.urlIcon || ''}
                  type="URL"
                  placeholder="https://cdn.webpage.com"
                />
                
                <Autocomplete
                  options={genders}
                  getOptionLabel={(gender) => gender}
                  id="auto-select"
                  value={personaje.genero || ''}
                  onChange={handleTextChange}
                  autoSelect
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Genero"
                      variant="standard"
                      name="genero"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Datos de nacimiento
                </Typography>
                <TextField
                  id="outlined-required"
                  label="Fecha de nacimiento"
                  type="date"
                  name="fechaNacimiento"
                  value={convertirFecha(personaje.fechaNacimiento) || ''}
                  onChange={handleTextChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  id="outlined-required"
                  label="Lugar de nacimiento"
                  name="lugarNacimiento"
                  value={personaje.lugarNacimiento || ''}
                  onChange={handleTextChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChildFriendlyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  id="outlined-textarea"
                  label="Descripción"
                  name="descripcion"
                  value={personaje.descripcion || ''}
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
                Actualizar personaje
              </Button>
            </Box>
          </div>
        </Box>
      </main>
      {/* Footer */}
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
