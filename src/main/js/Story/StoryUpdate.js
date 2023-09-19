const React = require("react");
const ReactDOM = require("react-dom/client");
import SaveAsIcon from "@mui/icons-material/SaveAs";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation";

import BookIcon from "@mui/icons-material/Book";

import axios from "axios";
import Footer from "../Footer";
import Alert from "@mui/material/Alert";



import createDarkTheme from "../theme";
const theme = createDarkTheme(JSON.parse(localStorage.getItem("darkMode")) === true);

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

export default function Update() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .put("/api/historias/update", {
          id: historia.id,
          nombreHistoria: data.get("nombreHistoria"),
          descripcion: data.get("descripcion"),
          generos: selectedGenres,
        })
        .then(() => {
          window.location.href = "/";
        });
    } catch (err) {
      console.log(err);
      let message = err.response.data;
      alertMessage = message;
      setShowAlert(true);
    }
  };
  const [showAlert, setShowAlert] = React.useState(false);


  const [genres, setGenres] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [historia, setHistoria] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/historias/generos")
      .then((response) => setGenres(response.data))
      .catch((error) => console.log(error));
  }, []);

  const historiaStr = localStorage.getItem("historia");
  let historiaTemp = historiaStr;

  React.useEffect(() => {
    if (historiaStr) {
      historiaTemp = JSON.parse(historiaStr);
      setHistoria(historiaTemp);
      setSelectedGenres(historiaTemp.generos);
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  function handleTextChange(e) {
    setHistoria({ ...historia, [e.target.name]: e.target.value });
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
          Actualizar historia
        </Typography>
        <AlertCustom showAlert={showAlert} />

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
            <BookIcon sx={{ width: 56, height: 56 }} />
          </div>
          <TextField
            margin="normal"
            required
            id="nombreHistoria"
            label="Nombre de la historia"
            name="nombreHistoria"
            autoComplete="nombreHistoria"
            value={historia.nombreHistoria || ""}
            onChange={handleTextChange}
            autoFocus
          />
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
          >
            <Autocomplete
              multiple
              id="tags-outlined"
              options={genres}
              freeSolo
              fullWidth
              onChange={(event, value) => setSelectedGenres(value)}
              value={selectedGenres || []}
              getOptionLabel={(genre) => genre}
              sx={{ minWidth: 200 }}
              renderInput={(params) => (
                <TextField {...params} name="generos" label="Géneros" />
              )}
            />
          </Box>
          <TextField
            fullWidth
            id="outlined-textarea"
            label="Descripción"
            name="descripcion"
            value={historia.descripcion || ""}
            onChange={handleTextChange}
            multiline
            rows={4}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveAsIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Actualizar historia
          </Button>
        </Box>
      </main>
      {/* Footer */}
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
