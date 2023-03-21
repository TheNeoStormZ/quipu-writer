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

import BookIcon from "@mui/icons-material/Book";
import MapIcon from "@mui/icons-material/Map";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Badge from "@mui/material/Badge";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
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

var nombreDatosHistoria = ["Nombre de la historia", "Generos narrativos"];

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

export default function Historia() {
  const storyStr = localStorage.getItem("historia");
  const [datosHistoria, setDatosHistoria] = React.useState([]);
  const [historia, setHistoria] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  var storyTemp = storyStr;

  const [openDelete, setOpenDelete] = React.useState(false);

  const [arcs, setArcs] = React.useState([]);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleProccesDelete = () => {
    console.log(historia);
    axios
      .delete("/api/historias/delete", {
        data: {
          id: historia.id,
        },
      })
      .then((response) => {
        console.log("Item deleted successfully");
        navigate("/");
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
      .get("/api/historias/" + historia.id + "/export")
      .then((response) => {
        console.log(response);
        setOpenExportAlert(true);
        const url = window.URL.createObjectURL(
          new Blob([JSON.stringify(response.data)])
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", historia.nombreHistoria + ".json");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        setOpenExportFailAlert(true);
      });
  };

  const navigate = useNavigate();

  const handleNewArc = async (event) => {
    navigate("/historia/tramas/add");
  };

  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => Boolean(v) && !(Array.isArray(v) && v.length === 0)
      )
    );
  }

  function handleClick(index) {
    var tramaGuardada = JSON.stringify(arcs[index]);
    localStorage.setItem("trama", tramaGuardada);
    setTimeout(navigate("/historia/trama/info"), 20);
  }

  React.useEffect(() => {
    if (storyStr) {
      storyTemp = removeEmpty(JSON.parse(storyStr));
      setHistoria(storyTemp);
      localStorage.removeItem("trama");

      var { nombreHistoria, generos } = storyTemp; // desestructuración de objetos
      var datosHistoriaTemp = [
        nombreHistoria,
        generos !== undefined ? generos.join(", ") : "Sin géneros",
      ]; // operador condicional y método join

      setDatosHistoria(datosHistoriaTemp);
      setArcs(storyTemp.tramas);
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
          Información de la historia
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
                <BookIcon sx={{ width: 98, height: 98 }} />

                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  {historia.nombreHistoria}
                  <IconButton aria-label="export" onClick={handleExport}>
                    <CloudDownloadIcon />
                  </IconButton>

                  <IconButton aria-label="edit">
                    <LinkRouter to="/historia/update">
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
              {datosHistoria.map((personajeDato, index) => (
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
                    {nombreDatosHistoria[index]}
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
              {historia.descripcion && (
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
                    {historia.descripcion}
                  </Typography>
                </div>
              )}
              <div>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Tramas
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<CreateNewFolderIcon />}
                  sx={{ mt: 2, ml: 2 }}
                  onClick={handleNewArc}
                >
                  Añadir Trama
                </Button>
              </div>
            </Box>
          </div>
        </Box>
        <Container sx={{ py: 2 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {Array.isArray(arcs) &&
              !arcs.some((e) => e === null) &&
              arcs.map((trama, index) => (
                <Grid item key={trama.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea onClick={() => handleClick(index)}>
                      <CardHeader avatar={<MapIcon />} />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {trama.nombreTrama}
                        </Typography>
                        <Typography>{trama.descripcion}</Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions
                      sx={{
                        width: "100%",
                        justifyContent: "flex-end",
                        pr: 3,
                        mt: "auto",
                      }}
                    >
                      <Badge
                        badgeContent={trama.escenas.length}
                        color="primary"
                      >
                        <FilterHdrIcon color="action" />
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
