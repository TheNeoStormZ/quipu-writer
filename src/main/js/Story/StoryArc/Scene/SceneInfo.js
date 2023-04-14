const React = require("react");
const ReactDOM = require("react-dom");
import CloseIcon from "@mui/icons-material/Close";
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
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import Container from "@mui/material/Container";

import Grid from "@mui/material/Grid";

import DataTable from "./ContextTable";

import Modal from "../../../Utils/Modal";

import ReactPlayer from "react-player";

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

import Navigation from "../../../Navigation";

import axios from "axios";
import Footer from "../../../Footer";

const theme = createTheme();

var nombreDatosEscena = [
  "Nombre de la escena",
  "Fecha de la escena",
  "Ubicación",
];

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

  const [DBContext, setDBContext] = React.useState([]);
  const [showContext, setShowContext] = React.useState(false);

  const [personajesInvolucrados, setPersonajesInvolucrados] = React.useState(
    []
  );

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const closeModal = () => {
    setShowContext(false);
  };

  React.useEffect(() => {
    if (storyStr) {
      setHistoria(JSON.parse(storyStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }

    if (arcStr) {
      setTrama(JSON.parse(arcStr));
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  const handleProccesDelete = () => {
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

        var trama_temp = historia_recv.tramas.find(
          (trama_find) => trama_find.id === trama.id
        );
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

  function handleClick(index) {
    var personajeGuardado = JSON.stringify(personajesInvolucrados[index]);
    localStorage.setItem("personaje", personajeGuardado);
    setTimeout(navigate("/personaje/info"), 20);
  }

  function calcularEdadPersonaje(personaje) {
    // Obtener la fecha de nacimiento del personaje
    let fechaNacimiento = personaje.fechaNacimiento; // Suponemos que es un atributo de la clase Personaje

    // Crear dos objetos Date a partir de las fechas
    let fechaEscenaDate = new Date(escena.fecha); // Suponemos que fecha es una cadena válida para crear una fecha
    let fechaNacimientoDate = new Date(fechaNacimiento); // Suponemos que fechaNacimiento es una cadena válida para crear una fecha

    // Calcular la diferencia en años entre las dos fechas
    let edad =
      fechaEscenaDate.getFullYear() - fechaNacimientoDate.getFullYear();

    // Ajustar el resultado según el mes y el día de las fechas
    let mes = fechaEscenaDate.getMonth() - fechaNacimientoDate.getMonth();
    if (
      mes < 0 ||
      (mes === 0 && fechaEscenaDate.getDate() < fechaNacimientoDate.getDate())
    ) {
      edad--;
    }

    // Devolver la edad calculada
    return edad;
  }
  function hadleContextFromDBPedia() {
    var fecha = new Date(escena.fecha);
    let dia = fecha.getDate().toString().padStart(2, "0");
    let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    let anio = fecha.getFullYear().toString();

    axios
      .get(
        "https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbpedia-owl%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+prov%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0ASELECT+DISTINCT+%3Fevent+%3Fdate+%3Ftitle+%3Fsource%0D%0AWHERE+%7B%0D%0A++%3Fevent+rdf%3Atype+dbpedia-owl%3AEvent+.%0D%0A++%3Fevent+dbpedia-owl%3Adate+%3Fdate+.%0D%0A++%3Fevent+rdfs%3Alabel+%3Ftitle+.%0D%0A++FILTER+%28xsd%3Adate%28%3Fdate%29+%3E%3D+xsd%3Adate%28%22" +
          anio +
          "-01-01%22%29+%26%26+xsd%3Adate%28%3Fdate%29+%3C%3D+xsd%3Adate%28%22" +
          anio +
          "-" +
          mes +
          "-" +
          dia +
          "%22%29%29%0D%0A++FILTER+%28langMatches%28lang%28%3Ftitle%29%2C+%22es%22%29%29%0D%0A++OPTIONAL+%7B%3Fevent+prov%3AwasDerivedFrom+%3Fsource%7D.%0D%0A%7D%0D%0AORDER+BY+DESC%28%3Fdate%29&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on"
      )
      .then((response) => {
        const div = document.getElementById("main-data");
        console.log(response.data.results.bindings);
        setDBContext(response.data.results.bindings);
        setShowContext(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  React.useEffect(() => {
    if (escenaStr) {
      sceneTemp = removeEmpty(JSON.parse(escenaStr));
      setEscena(sceneTemp);

      if (sceneTemp.fecha) {
      }

      //Guardamos en una lista independiente los personajes de la escena para poder listarlos correctamente
      setPersonajesInvolucrados(sceneTemp.personajesInvolucrados);

      // Creamos un array con las keys que queremos excluir del objeto
      var keysExcluidas = [
        "id",
        "nombreEscena",
        "descripcion",
        "musica",
        "personajesInvolucrados",
      ];

      var datosEscenaTemp = [
        Object.keys(sceneTemp)
          .filter((key) => !keysExcluidas.includes(key))
          .reduce((obj, key) => {
            obj[key] = sceneTemp[key];
            // Si la propiedad es fechaNacimiento y no es undefined, aplicar la función convertirFecha
            key === "fecha" && (obj[key] = convertirFecha(sceneTemp[key]));
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
          <div id="main-data">
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

              {escena.fecha && (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<ContentPasteSearchIcon />}
                  onClick={hadleContextFromDBPedia}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Obtener contexto
                </Button>
              )}

              {showContext && (
                <Modal>
                  <div
                    className="modal-content"
                    style={{
                      width: "80%",
                      maxHeight: "80%",
                      backgroundColor: "white",
                      padding: "20px",
                      overflowY: "scroll",
                    }}
                  >
                    <Typography
                      component="h3"
                      variant="h5"
                      align="left"
                      color="text.primary"
                      sx={{ mt: 2, ml: 2 }}
                      gutterBottom
                    >
                      Contexto histórico
                    </Typography>
                    <Typography
                      component="h5"
                      variant="h5"
                      align="left"
                      color="text.primary"
                      sx={{ mt: 2, ml: 2 }}
                      gutterBottom
                    >
                      Información procedente de:
                      <Link href={"https://dbpedia.org/"} sx={{ ml: 2 }}>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/DBpediaLogo.svg/263px-DBpediaLogo.svg.png"
                          alt="DBPedia"
                          width="120"
                          height="63"
                        />
                      </Link>
                    </Typography>
                    <DataTable data={DBContext} />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={closeModal}
                      sx={{ mt: 2 }}
                      startIcon={<CloseIcon />}
                    >
                      Cerrar
                    </Button>
                  </div>
                </Modal>
              )}

              {escena.musica && ReactPlayer.canPlay(escena.musica) && (
                <div>
                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.primary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    Musica de fondo
                  </Typography>

                  <ReactPlayer
                    url={escena.musica}
                    width="100%"
                    height="auto"
                    style={{ margin: "auto" }}
                  />
                </div>
              )}

              {escena.personajesInvolucrados &&
                Array.isArray(personajesInvolucrados) && (
                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.primary"
                    sx={{ mt: 2 }}
                    gutterBottom
                  >
                    Personajes involucrados
                  </Typography>
                )}

              <Container sx={{ py: 2 }} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={4}>
                  {Array.isArray(personajesInvolucrados) &&
                    personajesInvolucrados.map((personaje, index) => (
                      <Grid item key={personaje.id} xs={12} sm={6} md={4}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardActionArea onClick={() => handleClick(index)}>
                            <CardHeader
                              avatar={
                                <Avatar alt="Apple" src={personaje.urlIcon} />
                              }
                            />

                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                {personaje.nombre}
                              </Typography>
                              <Typography>{personaje.descripcion}</Typography>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Typography gutterBottom>
                              {calcularEdadPersonaje(personaje) < 0 &&
                                `Quedan ${Math.abs(
                                  calcularEdadPersonaje(personaje)
                                )} años para que nazca.`}
                              {calcularEdadPersonaje(personaje) >= 0 &&
                                `Edad: ${calcularEdadPersonaje(personaje)}`}
                            </Typography>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Container>
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
