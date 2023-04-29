const React = require("react");
const ReactDOM = require("react-dom/client");
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import Button from "@mui/material/Button";

import Navigation from "../Navigation";

import axios from "axios";
import Footer from "../Footer";

const theme = createTheme();

let alertMessage = "";

const AlertCustom = ({ showAlert }) => {
  if (!showAlert) {
    return null;
  }

  return (
    <Alert variant="outlined" severity="error" sx={{ m: 2 }}>
      {alertMessage}
    </Alert>
  );
};

function convertirFecha(fechaOriginal) {
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

export default function UserUpdate() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .put("/api/auth/update", {
          id: usuario.id,
          username: usuario.username,
          email: usuario.email,
          urlIcon: usuario.urlIcon,
          password: data.get("password"),
        })
        .then(() => {
          window.location.href = "/usuario/info";
        });
    } catch (err) {
      console.log(err);
      let message = err.response.data;
      alertMessage = message;
      setShowAlert(true);
    }
  };

  const [usuario, setUsuario] = React.useState([]);
  let usuarioTemp = "";


  const navigate = useNavigate();

  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => Boolean(v) && !(Array.isArray(v) && v.length === 0)
      )
    );
  }

  React.useEffect(() => {
    axios
      .get("/api/me")
      .then((response) => {
        usuarioTemp = removeEmpty(response.data);
        if (usuarioTemp) {
          usuarioTemp.password = "";
          setUsuario(usuarioTemp);
          console.log(usuarioTemp);
        } else {
          console.log("FATAL ERROR");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleTextChange(e) {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
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
          Actualizar inforrmación
        </Typography>

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
              <div
                style={{ display: "flex", alignItems: "left" }}
                sx={{ mt: 1 }}
              >
                <Avatar
                  alt="Avatar"
                  src={usuario.urlIcon}
                  sx={{ width: 98, height: 98, mb:1 }}
                />

                <TextField
                  required
                  id="outlined-required"
                  label="Nombre de usuario"
                  name="username"
                  value={usuario.username || ""}
                  onChange={handleTextChange}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "left" }}
                key={"email"}
                sx={{ mt: 2 }}
              >
                <TextField
                  required
                  id="outlined-required"
                  label="Correo electronico"
                  name="email"
                  value={usuario.email || ""}
                  onChange={handleTextChange}
                />

                <TextField
                  id="outlined-required"
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={usuario.password || ""}
                  onChange={handleTextChange}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "left" }}
                key={"email"}
              >
                <TextField
                  id="outlined"
                  label="URL icono"
                  name="urlIcon"
                  onChange={handleTextChange}
                  value={usuario.urlIcon || ""}
                  type="URL"
                  placeholder="https://cdn.webpage.com"
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<SaveAsIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Actualizar datos
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
