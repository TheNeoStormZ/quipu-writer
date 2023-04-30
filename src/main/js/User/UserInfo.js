const React = require("react");
const ReactDOM = require("react-dom/client");
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import Navigation from "../Navigation";

import axios from "axios";
import Footer from "../Footer";

const theme = createTheme();

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
  let fechaFormateada = `${dia}-${mes}-${anio}`;

  return fechaFormateada;
}

export default function Usuario() {
  const [usuario, setUsuario] = React.useState([]);
  let usuarioTemp = "";

  const [openDelete, setOpenDelete] = React.useState(false);

  const [numHistorias, setNumHistorias] = React.useState("");

  const [numPersonajes, setNumPersonajes] = React.useState("");

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleProccesDelete = () => {
    console.log(usuario);
    axios
      .delete("/api/auth/delete")
      .then((response) => {
        console.log("User deleted successfully");
        window.location.href="/";
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

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
          setUsuario(usuarioTemp);
          console.log(usuarioTemp);
          handleUserData();
        } else {
          console.log("FATAL ERROR");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleUserData() {
    axios
      .get("/api/me/mydata")
      .then((response) => {
        setNumHistorias(response.data[0]["second"]);
        setNumPersonajes(response.data[1]["second"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Eliminar cuenta?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Seguro de que desea eliminar su usuario? Esta acción no se puede
              deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProccesDelete} color="error">
              Eliminar
            </Button>
            <Button onClick={handleCloseDelete} autoFocus>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        <Typography
          sx={{ mt: 2, ml: 2 }}
          component="h1"
          variant="h4"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Información del usuario
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
            <Box>
              <div style={{ display: "flex", alignItems: "left" }}>
                <Avatar
                  alt="Avatar"
                  src= {usuario.urlIcon}
                  sx={{ width: 98, height: 98 }}
                />

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {usuario.username}

                  <IconButton aria-label="edit">
                    <LinkRouter to="/usuario/update">
                      {" "}
                      <EditIcon />
                    </LinkRouter>
                  </IconButton>

                  <IconButton
                    aria-label="delete"
                    onClick={handleClickOpenDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Typography>
              </div>
              <div
                style={{ display: "flex", alignItems: "left" }}
                key={"email"}
              >
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Correo electronico
                </Typography>

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.secondary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {usuario.email}
                </Typography>
              </div>

              <div
                style={{ display: "flex", alignItems: "left" }}
                key={"historias"}
              >
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Número de historias:
                </Typography>

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.secondary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {numHistorias}
                </Typography>
              </div>

              <div
                style={{ display: "flex", alignItems: "left" }}
                key={"historias"}
              >
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Número de personajes:
                </Typography>

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.secondary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {numPersonajes}
                </Typography>
              </div>
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
