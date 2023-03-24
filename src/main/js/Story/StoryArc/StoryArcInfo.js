const React = require("react");
const ReactDOM = require("react-dom/client");
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MapIcon from "@mui/icons-material/Map";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import Badge from "@mui/material/Badge";

import FilterHdrIcon from '@mui/icons-material/FilterHdr';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader
} from "@mui/material";

import Navigation from "../../Navigation";

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

var nombreDatosTrama = ["Nombre de la trama", "Fecha"];

function convertirFecha(fechaOriginal) {
  // Si fechaOriginal es undefined, se devuelve tal cual
  if (fechaOriginal === undefined) return "Sin fecha";

  // Si fechaOriginal no es undefined, se continúa con la conversión
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

export default function Trama() {
  const tramaStr = localStorage.getItem("trama");
  const [datosTrama, setDatosTrama] = React.useState([]);
  const [trama, setTrama] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  var arcTemp = tramaStr;

  const [openDelete, setOpenDelete] = React.useState(false);
  const storyStr = localStorage.getItem("historia");
  const [historia, setHistoria] = React.useState([]);
  const [scenes, setScenes] = React.useState([]);

  const navigate = useNavigate();

  function handleClick(index) {
    var escenaGuardada = JSON.stringify(scenes[index]);
    localStorage.setItem("escena", escenaGuardada);
    setTimeout(navigate("/historia/trama/escena/info"), 20);
  }

  const handleNewScene = async (event) => {
    navigate("/historia/trama/escenas/add");
  };
  
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleProccesDelete = () => {
    console.log(trama);
    axios
      .delete("/api/historia/trama/delete", {
        data: {
          id: trama.id,
        },
      })
      .then((response) => {
        console.log("Item deleted successfully");
        // Obtener el objeto JSON que se recibe de respuesta
        var historia = response.data;

        // Guardar el objeto JSON en el localStorage como historia
        localStorage.setItem("historia", JSON.stringify(historia));

        navigate("/historia/info");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };


  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => Boolean(v) && !(Array.isArray(v) && v.length === 0)
      )
    );
  }

  React.useEffect(() => {
    if (storyStr) {
      setHistoria(JSON.parse(storyStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  

  function ordenarEscenasPorFecha(escenas) {
    // Si escenas no es un array o está vacío, se devuelve tal cual
    if (!Array.isArray(escenas) || escenas.length === 0) return escenas;
    // Si escenas es un array válido y no está vacío, se ordena por fecha
    return escenas.sort(function(a, b) {
      // Si alguna de las fechas es nula o undefined, se pone al final
      if (a.fecha == null || a.fecha == undefined) return 1;
      if (b.fecha == null || b.fecha == undefined) return -1;
      // Si ambas fechas son válidas, se comparan sus valores numéricos
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
  }

  React.useEffect(() => {
    if (tramaStr) {
      arcTemp = removeEmpty(JSON.parse(tramaStr));
      setTrama(arcTemp);
      setScenes(ordenarEscenasPorFecha(arcTemp.escenas));

      var { nombreTrama, fechaGlobal } = arcTemp; // desestructuración de objetos
      var datosTramaTemp = [nombreTrama, convertirFecha(fechaGlobal)];

      setDatosTrama(datosTramaTemp);
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
            {"¿Eliminar historia?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Seguro de que desea eliminar la historia? Esta acción no se puede
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
          Información de la trama
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
                <MapIcon sx={{ width: 98, height: 98 }} />

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {trama.nombreTrama}

                  <IconButton aria-label="edit">
                    <LinkRouter to="/historia/trama/update">
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
              {datosTrama.map((tramaDato, index) => (
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
                    {nombreDatosTrama[index]}
                  </Typography>

                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.secondary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    {tramaDato}
                  </Typography>
                </div>
              ))}
              {trama.descripcion && (
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
                    {trama.descripcion}
                  </Typography>
                </div>
              )}
            </Box>
            <Typography
              component="h3"
              variant="h5"
              align="left"
              color="text.primary"
              sx={{ mt: 2, ml: 2 }}
              gutterBottom
            >
              Escenas
            </Typography>
            <Button
              variant="contained"
              endIcon={<FilterHdrIcon />}
              sx={{ mt: 2, ml: 2 }}
              onClick={handleNewScene}
            >
              Añadir Escena
            </Button>
          </div>
        </Box>

        <Container sx={{ py: 2 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {Array.isArray(scenes) &&
              !scenes.some((e) => e === null) &&
              scenes.map((escena, index) => (
                <Grid item key={escena.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea onClick={() => handleClick(index)}>
                      <CardHeader avatar={<FilterHdrIcon />} />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {escena.nombreEscena}
                        </Typography>
                        <Typography>{escena.descripcion}</Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions sx={{ width: '100%', justifyContent: 'flex-end', pr:3, mt:"auto"}}>
                    <Badge badgeContent={escena.personajesInvolucrados.length} color="primary">
                      <PeopleAltIcon color="action" />
                    </Badge>
                  </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
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
