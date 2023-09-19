const React = require("react");
const ReactDOM = require("react-dom/client");
import SaveAsIcon from "@mui/icons-material/SaveAs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../../Navigation";

import { useNavigate } from "react-router-dom";

import BookIcon from "@mui/icons-material/Book";

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import axios from "axios";
import Footer from "../../Footer";
import Alert from "@mui/material/Alert";


import createDarkTheme from "../../theme";
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
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .put("/api/historia/trama/update", {
          id: trama.id,
          nombreTrama: data.get("nombreTrama"),
          descripcion: data.get("descripcion"),
        })
        .then((response) => {
          // Obtener el objeto JSON que se recibe de respuesta
          let historia = response.data;

          // Guardar el objeto JSON en el localStorage como historia
          localStorage.setItem("historia", JSON.stringify(historia));

          // Redirigir a la página principal
          navigate("/historia/info");
        });
    } catch (err) {
      console.log(err);
      let message = err.response.data;
      alertMessage = message;
      setShowAlert(true);
    }
  };
  const [showAlert, setShowAlert] = React.useState(false);


  const [historia, setHistoria] = React.useState([]);
  const [trama, setTrama] = React.useState([]);

  const tramaStr = localStorage.getItem("trama");
  const storyStr = localStorage.getItem("historia");
  let tramaTemp = tramaStr;

  React.useEffect(() => {
    if (storyStr) {
      setHistoria(JSON.parse(storyStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  React.useEffect(() => {
    if (tramaStr) {
      tramaTemp = JSON.parse(tramaStr);
      setTrama(tramaTemp);
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  function handleTextChange(e) {
    setTrama({ ...trama, [e.target.name]: e.target.value });
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
          {" "}
          <SubdirectoryArrowRightIcon />
          Actualizar trama
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
            id="nombreTrama"
            label="Nombre de la trama"
            name="nombreTrama"
            autoComplete="nombreTrama"
            value={trama.nombreTrama || ""}
            onChange={handleTextChange}
            autoFocus
          />

          <TextField
            fullWidth
            id="outlined-textarea"
            label="Descripción"
            name="descripcion"
            value={trama.descripcion || ""}
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
            Actualizar trama
          </Button>
        </Box>
      </main>
      {/* Footer */}
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
