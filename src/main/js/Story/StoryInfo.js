const React = require("react");
const ReactDOM = require("react-dom/client");
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import BookIcon from "@mui/icons-material/Book";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import MapIcon from "@mui/icons-material/Map";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import Badge from "@mui/material/Badge";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { Chrono } from "react-chrono";
import Modal from "../Utils/Modal";

import TimelineIcon from "@mui/icons-material/Timeline";

import Navigation from "../Navigation";

import axios from "axios";
import Footer from "../Footer";

const theme = createTheme();

let nombreDatosHistoria = ["Nombre de la historia", "Generos narrativos"];

function convertirFecha(fechaOriginal) {
  // Si fechaOriginal es undefined, se devuelve tal cual
  if (fechaOriginal === undefined || fechaOriginal == null) return "Sin fecha";

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

export default function Historia() {
  const storyStr = localStorage.getItem("historia");
  const [datosHistoria, setDatosHistoria] = React.useState([]);
  const [historia, setHistoria] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  let storyTemp = storyStr;

  const [openDelete, setOpenDelete] = React.useState(false);

  const [arcs, setArcs] = React.useState([]);

  const [showTimeline, setShowTimeline] = React.useState(false);

  const [timeline, setTimeline] = React.useState([]);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const closeModal = () => {
    setShowTimeline(false);
  };

  function obtenerRelaciones(pid) {
    let url = "/api/personajes/relaciones/" + pid + "/detailed";
    return axios
      .get(url)
      .then((response) => {
        let datos = response.data;
        return datos;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleTimeline = async () => {
    let escenas = historia.tramas.flatMap((trama) =>
      trama.escenas.flatMap((escena) => escena)
    );

    let personajesInvolucrados = new Set(
      escenas.flatMap((escena) => escena.personajesInvolucrados)
    );

    let promesasRelaciones = Array.from(personajesInvolucrados).map(
      (personaje) => obtenerRelaciones(personaje.id)
    );
    
    let reSinDuplicados = [];

    try {
      let resultados = (await Promise.all(promesasRelaciones)).flat();
      let ids = new Set();
      resultados.forEach((obj) => {
        if (!ids.has(obj.id)) {
          ids.add(obj.id);
          reSinDuplicados.push(obj);
        }
      });
    } catch (error) {
      console.error(error);
    }

    let lista = escenas.reduce((acumulador, escena) => {
      // Añadir la fecha y el nombre de la escena al acumulador junto con otros datos relevantes
      // Solo si escena.fecha no es null o undefined
      if (escena.fecha != null) {
        acumulador.push({
          title: convertirFecha(escena.fecha),
          orderTime: escena.fecha,
          cardTitle: escena.nombreEscena,
          cardSubtitle: escena.ubicacion ? escena.ubicacion : "",
          cardDetailedText: [escena.descripcion || ""],
        });
      }
      // Añadir las fechas y los nombres de los personajes involucrados al acumulador
      for (let personaje of escena.personajesInvolucrados) {
        // Comprobar si los apellidos del personaje existen y no están vacíos
        let primerApellido = personaje.primerApellido || "";
        let segundoApellido = personaje.segundoApellido || "";
        // Formar el nombre completo del personaje con los apellidos si los hay
        let nombreCompleto =
          personaje.nombre +
          (primerApellido ? " " + primerApellido : "") +
          (segundoApellido ? " " + segundoApellido : "");
        // Añadir la fecha y el nombre completo del personaje al acumulador junto con otros datos relevantes
        if (personaje.fechaNacimiento != null) {
          acumulador.push({
            title: convertirFecha(personaje.fechaNacimiento),
            orderTime: personaje.fechaNacimiento,
            cardTitle: "Nacimiento de " + nombreCompleto,
            cardSubtitle: personaje.genero ? personaje.genero : "",
            cardDetailedText: personaje.descripcion,
          });
        }
      }
      // Devolver el acumulador actualizado
      return acumulador;
    }, []); // Inicializar el acumulador como un array vacío

    // Ordenar la lista por fecha usando el método Array.prototype.sort()
    lista.sort((a, b) => new Date(a.orderTime) - new Date(b.orderTime));

    //Añadimos los datos de las relaciones con los limites establecidos por la información anterior

    for (let dato of reSinDuplicados) {
      // Comprobar si la fecha del dato no es inferior al primer elemento ni superior al último
      if (
        dato.fecha >= lista[0].orderTime &&
        dato.fecha <= lista[lista.length - 1].orderTime
      ) {
        // Añadir el dato a la lista
        lista.push({
          title: convertirFecha(dato.fecha),
          orderTime: dato.fecha,
          cardTitle:
            "Los personajes " +
            dato.personajesInvolucrados
              .map((personaje) => personaje.nombre)
              .reduce((prev, curr, index, array) => {
                if (index === 0) {
                  return curr;
                } else if (index === array.length - 1) {
                  return prev + " y " + curr;
                } else {
                  return prev + ", " + curr;
                }
              }, "") +
            " están en una nueva relación",
          cardSubtitle: "Nueva relación",
          cardDetailedText:
            "Los personajes " +
            dato.personajesInvolucrados
              .map((personaje) => personaje.nombre)
              .reduce((prev, curr, index, array) => {
                if (index === 0) {
                  return curr;
                } else if (index === array.length - 1) {
                  return prev + " y " + curr;
                } else {
                  return prev + ", " + curr;
                }
              }, "") +
            " han entrado en una relación con la descripción: \n" +
            dato.descripcion,
        });
      }
    }

    lista.sort((a, b) => new Date(a.orderTime) - new Date(b.orderTime));

    setTimeline(lista);

    setShowTimeline(true);
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
    let tramaGuardada = JSON.stringify(arcs[index]);
    localStorage.setItem("trama", tramaGuardada);
    setTimeout(navigate("/historia/trama/info"), 20);
  }

  function ordenarTramasPorFecha(tramas) {
    // Si escenas no es un array o está vacío, se devuelve tal cual
    if (!Array.isArray(tramas) || tramas.length === 0) return tramas;
    // Si escenas es un array válido y no está vacío, se ordena por fecha
    return tramas.sort(function (a, b) {
      // Si alguna de las fechas es nula o undefined, se pone al final
      if (a.fechaGlobal == null || a.fechaGlobal == undefined) return 1;
      if (b.fechaGlobal == null || b.fechaGlobal == undefined) return -1;
      // Si ambas fechas son válidas, se comparan sus valores numéricos
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
  }

  React.useEffect(() => {
    if (storyStr) {
      storyTemp = removeEmpty(JSON.parse(storyStr));
      setHistoria(storyTemp);
      localStorage.removeItem("trama");

      let { nombreHistoria, generos } = storyTemp; // desestructuración de objetos
      let datosHistoriaTemp = [
        nombreHistoria,
        generos !== undefined ? generos.join(", ") : "Sin géneros",
      ]; // operador condicional y método join

      setDatosHistoria(datosHistoriaTemp);

      setArcs(ordenarTramasPorFecha(storyTemp.tramas));
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
                  key={personajeDato}
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
              {showTimeline && (
                <Modal>
                  <div
                    className="modal-content"
                    style={{
                      width: "80%",
                      backgroundColor: "white",
                      marginTop: "115vh",
                      marginBottom: "10vh",
                      overflowY: "scroll",
                      boxSizing: "border-box",
                    }}
                  >
                    <div>
                      <Typography
                        component="h3"
                        variant="h5"
                        align="left"
                        color="text.primary"
                        sx={{ mt: 2, ml: 2 }}
                        gutterBottom
                      >
                        Linea de tiempo
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={closeModal}
                        sx={{ ml: 2 }}
                        startIcon={<CloseIcon />}
                      >
                        Cerrar
                      </Button>
                    </div>

                    <Chrono
                      items={timeline}
                      mode="VERTICAL_ALTERNATING"
                      scrollable
                      enableOutline
                      theme={{
                        primary: "#191970",
                        secondary: "grey",
                        cardBgColor: "white",
                        titleColor: "#CC5500",
                        titleColorActive: "white",
                        outline: "blue",
                      }}
                    />
                  </div>
                </Modal>
              )}
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
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<TimelineIcon />}
                  onClick={handleTimeline}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Linea de tiempo
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

                      <Badge
                        badgeContent={trama.numPersonajes}
                        color="primary"
                        sx={{ pl: 2 }}
                      >
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
      <Footer />
      {/* End footer */}
    </ThemeProvider>
  );
}
