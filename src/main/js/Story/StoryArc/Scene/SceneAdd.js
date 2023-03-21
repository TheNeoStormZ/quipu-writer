const React = require("react");
const ReactDOM = require("react-dom/client");
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MapIcon from "@mui/icons-material/Map";
import Navigation from "../../../Navigation";

import { useNavigate } from "react-router-dom";

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import EventIcon from "@mui/icons-material/Event";
import InputAdornment from "@mui/material/InputAdornment";


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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .post("/api/historia/trama/" + trama.id  + "/escena/new", {
          nombreEscena: data.get("nombreEscena"),
          ubicacion: data.get("ubicacion"),
          fecha: data.get("fechaEscena"),
          descripcion: data.get("descripcion"),
        })
        .then((response) => {
          // Obtener el objeto JSON que se recibe de respuesta
          var historia_recv = response.data;

          // Guardar el objeto JSON en el localStorage como trama
          localStorage.setItem("historia", JSON.stringify(historia_recv));
          var trama_temp = historia_recv.tramas.find(trama_find => trama_find.id === trama.id);
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
