const React = require("react");
const ReactDOM = require("react-dom/client");
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Collapse } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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

var nombreDatos = [
  "Apellido 1",
  "Apellido 2",
  "Residencia",
  "Fecha de nacimiento",
  "Genero",
  "Altura",
  "Lugar de nacimiento",
];

function convertirFecha(fechaOriginal) {
  // Crear objeto Date a partir de la fecha original
  let fecha = new Date(fechaOriginal);

  // Obtener componentes de la fecha
  let dia = fecha.getDate().toString().padStart(2, "0");
  let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  let anio = fecha.getFullYear().toString();

  // Formatear la fecha en la cadena deseada
  let fechaFormateada = `${dia}-${mes}-${anio}`;

  return fechaFormateada;
}

export default function Personaje() {
  const personajeStr = localStorage.getItem("personaje");
  const [datosPersonaje, setDatosPersonaje] = React.useState([]);
  const [personaje, setPersonaje] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  var personajeTemp = personajeStr;

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleProccesDelete = () => {
    console.log(personaje);
    axios
      .delete("/api/personajes/delete", {
        data: {
          id: personaje.id,
        },
      })
      .then((response) => {
        console.log("Item deleted successfully");
        navigate("/personajes");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleExport = () => {
    axios
      .get("/api/personajes/" + personaje.id + "/export")
      .then((response) => {
        console.log(response);
        setOpenExportAlert(true);
        const url = window.URL.createObjectURL(
          new Blob([JSON.stringify(response.data)])
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", personaje.nombre + ".json");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        setOpenExportFailAlert(true);
      });
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
    if (personajeStr) {
      personajeTemp = removeEmpty(JSON.parse(personajeStr));
      setPersonaje(personajeTemp);

      // Creamos un array con las keys que queremos excluir del objeto
      var keysExcluidas = ["id", "nombre", "descripcion","urlIcon"];

      var datosPersonajeTemp = [
        Object.keys(personajeTemp)
          .filter((key) => !keysExcluidas.includes(key))
          .reduce((obj, key) => {
            obj[key] = personajeTemp[key];
            // Si la propiedad es fechaNacimiento y no es undefined, aplicar la función convertirFecha
            key === "fechaNacimiento" &&
              (obj[key] = convertirFecha(personajeTemp[key]));
            // Si la propiedad es altura y no es undefined, añadir el sufijo " cm"
            key === "altura" && (obj[key] = personajeTemp[key] + " cm");
            return obj;
          }, {}),
      ];

      datosPersonajeTemp = Object.values(datosPersonajeTemp[0]);
      datosPersonajeTemp.shift();

      setDatosPersonaje(datosPersonajeTemp);

      // Iterar sobre las claves del objeto
      Object.keys(personajeTemp).forEach((key) => {
        // Si la propiedad es undefined
        if (personajeTemp[key] === undefined) {
          // Buscar el índice del elemento en el array que coincide con la clave
          var indice = nombreDatos.indexOf(
            key.charAt(0).toUpperCase() + key.slice(1)
          );
          // Si se encuentra el índice
          if (indice !== -1) {
            // Eliminar el elemento en ese índice
            nombreDatos.splice(indice, 1);
          }
        }
      });
    } else {
      console.log("FATAL ERROR");
      navigate("/personajes");
    }
  }, []);

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
            {"¿Eliminar personaje?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Seguro de que desea eliminar el personaje? Esta acción no se
              puede deshacer.
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

        <Collapse in={openExportAlert}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenExportAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            "¡Archivo exportado con exito!"
          </Alert>
        </Collapse>

        <Collapse in={openExportFailAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenExportFailAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Ha ocurrido un error al exportar. Intentalo mas tarde.
          </Alert>
        </Collapse>

        <Typography
          sx={{ mt: 2, ml: 2 }}
          component="h1"
          variant="h4"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Información del personaje
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
                  src={personaje.urlIcon}
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
                  {personaje.nombre}
                  <IconButton aria-label="export" onClick={handleExport}>
                    <CloudDownloadIcon />
                  </IconButton>

                  <IconButton aria-label="edit">
                    <LinkRouter to="/personaje/update">
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
              {datosPersonaje.map((personajeDato, index) => (
                <div
                  style={{ display: "flex", alignItems: "left" }}
                  key={index}
                >
                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.primary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    {nombreDatos[index]}
                  </Typography>

                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.secondary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    {personajeDato}
                  </Typography>
                </div>
              ))}
              <div>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Descripción
                </Typography>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.secondary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {personaje.descripcion || "Sin descripción"}
                </Typography>
              </div>
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
