const React = require("react");
const ReactDOM = require("react-dom/client");
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import EventIcon from "@mui/icons-material/Event";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation";

import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Quipu
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Creation() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .post("/api/personajes/new", {
          nombre: data.get("nombre"),
          primerApellido: data.get("primerApellido"),
          segundoApellido: data.get("segundoApellido"),
          fechaNacimiento: data.get("fechaNacimiento"),
          lugarNacimiento: data.get("lugarNacimiento"),
          altura: data.get("altura"),
          residencia: data.get("residencia"),
          descripcion: data.get("descripcion"),
          genero: data.get("genero"),
          urlIcon: data.get("url-icon"),
        })
        .then((window.location.href = "/personajes"));
    } catch (err) {
      console.log(err);
      message = err.response.data;
      setShowAlert(true);
    }
  };
  const [showAlert, setShowAlert] = React.useState(false);
  const AlertCustom = () => (
    <Alert variant="outlined" severity="error" sx={{ m: 2 }}>
      {message}
    </Alert>
  );

  const [genders, setGenders] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/personajes/generos")
      .then((response) => setGenders(response.data))
      .catch((error) => console.log(error));
  }, []);

  const [avatarUrl, setAvatarUrl] = React.useState("");

  const handleAvatarUrlChange = (event) => {
    setAvatarUrl(event.target.value);
  };

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
          Añadir personaje
        </Typography>
        {showAlert ? <AlertCustom /> : null}
        <Box
          sx={{
            "& .MuiTextField-root": { m:1, width: { xs: '98%', sm: '25ch' }  },
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <Box component="form" onSubmit={handleSubmit} 
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
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
                />
                <TextField
                  id="outlined-required"
                  label="Apellido 1"
                  name="primerApellido"
                />
              </div>
              <div>
                <TextField
                  id="outlined-required"
                  label="Apellido 2"
                  name="segundoApellido"
                />
                <TextField
                  id="outlined-required"
                  label="Residencia"
                  name="residencia"
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">cm</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="outlined"
                  label="URL icono"
                  name="url-icon"
                  onChange={handleAvatarUrlChange}
                  type="URL"
                  placeholder="https://cdn.webpage.com"
                />
                <Autocomplete
                  options={genders}
                  getOptionLabel={(gender) => gender}
                  id="auto-select"
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
                  multiline
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Crear personaje
              </Button>
            </Box>
          </div>
        </Box>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Acerca de
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Quipu, un proyecto para los que sueñan a lo grande
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
