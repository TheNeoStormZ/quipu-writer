const React = require("react");
const ReactDOM = require("react-dom/client");
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../Navigation";
import Footer from "../Footer";

import BookIcon from "@mui/icons-material/Book";

import { useNavigate } from "react-router-dom";


import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import axios from "axios";
import Alert from "@mui/material/Alert";

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

const theme = createTheme();

export default function Creation() {

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      if (fastCreationMode) {
        await axios
          .post("/api/historias/new/fast", {
            nombreHistoria: data.get("nombreHistoria"),
            descripcion: data.get("descripcion"),
            generos: selectedGenres,
          })
          .then((response) => {
            // Obtener el objeto JSON que se recibe de respuesta
            let historia = response.data;

            console.log(historia);

            let trama = historia["tramas"][0];

            // Guardar el objeto JSON en el localStorage como historia
            localStorage.setItem("historia", JSON.stringify(historia));
            localStorage.setItem("trama", JSON.stringify((trama)));

            // Redirigir a la página de creación de trama
            navigate("/historia/trama/escenas/add");
          });
      } else {
        await axios
          .post("/api/historias/new", {
            nombreHistoria: data.get("nombreHistoria"),
            descripcion: data.get("descripcion"),
            generos: selectedGenres,
          })
          .then(() => {
            window.location.href = "/";
          });
      }
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
  const [fastCreationMode, setFastCreationMode] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("/api/historias/generos")
      .then((response) => setGenres(response.data))
      .catch((error) => console.log(error));
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
          Añadir historia
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
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="fastCreation"
                  name="fastCreation"
                  checked={fastCreationMode} // value es un estado booleano que representa el valor binario del checkbox
                  onChange={(e) => setFastCreationMode(e.target.checked)} // actualiza el valor al cambiar el checkbox
                />
              }
              label="Creación rapida"
            />
          </FormGroup>
          <TextField
            margin="normal"
            required
            id="nombreHistoria"
            label="Nombre de la historia"
            name="nombreHistoria"
            autoComplete="nombreHistoria"
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
              getOptionLabel={(genre) => genre}
              sx={{ minWidth: 200 }}
              renderInput={(params) => (
                <TextField {...params} name="generos" label="Generos" />
              )}
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
            Crear historia
          </Button>
        </Box>
      </main>
      {/* Footer */}
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
