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

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import Navigation from "../../../Navigation";

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

var nombreDatosEscena = [
  "Nombre de la escena",
  "Fecha de la escena",
  "Ubicación",
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

export default function Escena() {
  const escenaStr = localStorage.getItem("escena");
  const [datosEscena, setDatosEscena] = React.useState([]);
  const [escena, setEscena] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  var sceneTemp = escenaStr;

  const [openDelete, setOpenDelete] = React.useState(false);
  const storyStr = localStorage.getItem("historia");
  const arcStr = localStorage.getItem("trama");
  const [historia, setHistoria] = React.useState([]);
  const [trama, setTrama] = React.useState([]);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  React.useEffect(() => {
    if (storyStr) {
      setHistoria(JSON.parse(storyStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  React.useEffect(() => {
    if (arcStr) {
      setTrama(JSON.parse(arcStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  const handleProccesDelete = () => {
    console.log(escena);
    axios
      .delete("/api/historia/trama/escena/delete", {
        data: {
          id: escena.id,
        },
      })
      .then((response) => {
        console.log("Item deleted successfully");
        // Obtener el objeto JSON que se recibe de respuesta
        var historia_recv = response.data;

        // Guardar el objeto JSON en el localStorage como trama
        localStorage.setItem("historia", JSON.stringify(historia_recv));

        var trama_temp = historia_recv.tramas.find(trama_find => trama_find.id === trama.id);
        localStorage.setItem("trama", JSON.stringify(trama_temp));

        navigate("/historia/trama/info");
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
    if (escenaStr) {
      sceneTemp = removeEmpty(JSON.parse(escenaStr));
      setEscena(sceneTemp);

      // Creamos un array con las keys que queremos excluir del objeto
      var keysExcluidas = ["id", "nombreEscena", "descripcion"];

      var datosEscenaTemp = [
        Object.keys(sceneTemp)
          .filter((key) => !keysExcluidas.includes(key))
          .reduce((obj, key) => {
            obj[key] = sceneTemp[key];
            // Si la propiedad es fechaNacimiento y no es undefined, aplicar la función convertirFecha
            key === "fechaEscena" &&
              (obj[key] = convertirFecha(sceneTemp[key]));
            return obj;
          }, {}),
      ];

      datosEscenaTemp = Object.values(datosEscenaTemp[0]);
      datosEscenaTemp.shift();

      setDatosEscena(datosEscenaTemp);
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
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Eliminar escena?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Seguro de que desea eliminar la escena? Esta acción no se puede
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
          Información de la escena
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
                <FilterHdrIcon sx={{ width: 98, height: 98 }} />

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {escena.nombreEscena}

                  <IconButton aria-label="edit">
                    <LinkRouter to="/historia/trama/escena/update">
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
              {datosEscena.map((escenaDato, index) => (
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
                    {nombreDatosEscena[index]}
                  </Typography>

                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.secondary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    {escenaDato}
                  </Typography>
                </div>
              ))}
              {escena.descripcion && (
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
                    {escena.descripcion}
                  </Typography>
                </div>
              )}
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
