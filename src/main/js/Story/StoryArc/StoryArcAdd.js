const React = require("react");
const ReactDOM = require("react-dom/client");
import MapIcon from "@mui/icons-material/Map";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Navigation from "../../Navigation";
import Footer from "../../Footer";

import { useNavigate } from "react-router-dom";

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import axios from "axios";



const theme = createTheme();


export default function Creation() {

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .post("/api/historia/" + historia.id + "/trama/new", {
          nombreTrama: data.get("nombreTrama"),
          descripcion: data.get("descripcion"),
        })
        .then((response) => {
          // Obtener el objeto JSON que se recibe de respuesta
          var historia = response.data;

          // Guardar el objeto JSON en el localStorage como historia
          localStorage.setItem("historia", JSON.stringify(historia));

          // Redirigir a la página principal
          navigate("/historia/info");
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
          Añadir trama
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
            <MapIcon sx={{ width: 56, height: 56 }} />
          </div>
          <TextField
            margin="normal"
            required
            id="nombreTrama"
            label="Nombre de la trama"
            name="nombreTrama"
            autoComplete="nombreTrama"
            autoFocus
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
            Crear trama
          </Button>
        </Box>
      </main>
      {/* Footer */}
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
