const React = require("react");
const ReactDOM = require("react-dom/client");
import MapIcon from "@mui/icons-material/Map";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../../../Navigation";

import { useNavigate } from "react-router-dom";

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import EventIcon from "@mui/icons-material/Event";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import InputAdornment from "@mui/material/InputAdornment";

import MusicNoteIcon from "@mui/icons-material/MusicNote";



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
  const navigate = useNavigate();

  const arcStr = localStorage.getItem("trama");
  const [trama, setTrama] = React.useState([]);
  const [selectedCharacters, setSelectedCharacters] = React.useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .post("/api/historia/trama/" + trama.id + "/escena/new", {
          nombreEscena: data.get("nombreEscena"),
          ubicacion: data.get("ubicacion"),
          fecha: data.get("fechaEscena"),
          musica: data.get("musica"),
          descripcion: data.get("descripcion"),
          personajesInvolucrados: selectedCharacters,
        })
        .then((response) => {
          // Obtener el objeto JSON que se recibe de respuesta
          var historia_recv = response.data;

          // Guardar el objeto JSON en el localStorage como trama
          localStorage.setItem("historia", JSON.stringify(historia_recv));
          var trama_temp = historia_recv.tramas.find(
            (trama_find) => trama_find.id === trama.id
          );
          console.log(trama_temp);
          localStorage.setItem("trama", JSON.stringify(trama_temp));

          // Redirigir a la página principal
          navigate("/historia/trama/info");
        });
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

  const storyStr = localStorage.getItem("historia");
  const [historia, setHistoria] = React.useState([]);

  const [personajes, setPersonajes] = React.useState([]);

  React.useEffect(() => {
    if (storyStr) {
      setHistoria(JSON.parse(storyStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }

    if (arcStr) {
      setTrama(JSON.parse(arcStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  React.useEffect(() => {
    axios
      .get("/api/personajes")
      .then((response) => {
        setPersonajes(response.data);
      })
      .catch((error) => console.log(error));
  },[]);

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
          {historia.nombreHistoria}
        </Typography>

        <Typography
          sx={{ mt: 2, ml: 4 }}
          component="h1"
          variant="h4"
          align="left"
          color="text.primary"
          gutterBottom
        >
          <SubdirectoryArrowRightIcon />
          {trama.nombreTrama}
        </Typography>

        <Typography
          sx={{ mt: 2, ml: 6 }}
          component="h1"
          variant="h4"
          align="left"
          color="text.primary"
          gutterBottom
        >
          <SubdirectoryArrowRightIcon />
          Añadir escena
        </Typography>
        {showAlert ? <AlertCustom /> : null}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            "& .MuiTextField-root": { m: 1, width: "75%" },
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          autoComplete="off"
        >
          <div>
            <FilterHdrIcon sx={{ width: 56, height: 56 }} />
          </div>
          <TextField
            margin="normal"
            required
            id="nombreEscena"
            label="Nombre de la escena"
            name="nombreEscena"
            autoComplete="nombreEscena"
            autoFocus
          />

          <TextField
            margin="normal"
            id="ubicacion"
            label="Ubicación"
            name="ubicacion"
            autoComplete="ubicacion"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            id="musica"
            label="Url de la musica"
            name="musica"
            autoComplete="musica"
            type="url"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MusicNoteIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="outlined-required"
            label="Fecha de la escena"
            type="date"
            name="fechaEscena"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
          >
            <Autocomplete
              multiple
              fullWidth
              options={personajes}
              getOptionLabel={(personaje) => personaje.nombre}
              id="tags-outlined"
              autoSelect
              onChange={(event, value) => setSelectedCharacters(value)}
              sx={{ minWidth: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Personajes"
                  name="personajes"
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>

          <TextField
            fullWidth
            id="outlined-textarea"
            label="Descripción"
            name="descripcion"
            multiline
            rows={4}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Crear escena
          </Button>
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
