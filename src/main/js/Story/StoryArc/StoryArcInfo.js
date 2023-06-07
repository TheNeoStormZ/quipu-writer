const React = require("react");
const ReactDOM = require("react-dom/client");
import CloseIcon from "@mui/icons-material/Close";
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
  CardHeader,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import MapIcon from "@mui/icons-material/Map";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import Badge from "@mui/material/Badge";

import FilterHdrIcon from "@mui/icons-material/FilterHdr";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import TimelineIcon from "@mui/icons-material/Timeline";

import Navigation from "../../Navigation";

import axios from "axios";
import Footer from "../../Footer";

import Modal from "../../Utils/Modal";
import { Chrono } from "react-chrono";

import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

const theme = createTheme();

let nombreDatosTrama = ["Nombre de la trama", "Fecha"];

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

export default function Trama() {
  const tramaStr = localStorage.getItem("trama");
  const [datosTrama, setDatosTrama] = React.useState([]);
  const [trama, setTrama] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  let arcTemp = tramaStr;

  const [openDelete, setOpenDelete] = React.useState(false);
  const storyStr = localStorage.getItem("historia");
  const [historia, setHistoria] = React.useState([]);
  const [scenes, setScenes] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState([]);

  const [personajesInvolucrados, setPersonajesInvolucrados] = React.useState(
    []
  );
  const [scenesFiltered, setScenesFiltered] = React.useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const navigate = useNavigate();

  function handleClick(index) {
    let escenaGuardada = JSON.stringify(scenes[index]);
    localStorage.setItem("escena", escenaGuardada);
    setTimeout(navigate("/historia/trama/escena/info"), 20);
  }

  const handleNewScene = async (event) => {
    navigate("/historia/trama/escenas/add");
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleSelectorChange = (event) => {
    const {
      target: { value },
    } = event;

    let personajesElegidos =
      typeof value === "string" ? value.split(",") : value;
    console.log(personajesElegidos);

    setSelectedFilter(personajesElegidos);

    if (personajesElegidos.length === 0) {
      // Si está vacío, mostramos todos los elementos
      setScenesFiltered(scenes);
    } else {
      let escenasFiltradas = trama.escenas.filter((escena) => {
        // Para cada escena, se usa Array.every para ver si todos los personajes de la lista están en la escena
        return personajesElegidos.every((p) => {
          // Para cada personaje de la lista, se usa Array.some para buscarlo en la escena por su id
          return escena.personajesInvolucrados.some((personaje) => {
            // Finalmente, se usa JSON.parse para convertir la cadena en un objeto antes de comparar los ids
            return JSON.parse(p).id === personaje.id;
          });
        });
      });
      setScenesFiltered(escenasFiltradas);
    }
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
        let historia = response.data;

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

  const [showTimeline, setShowTimeline] = React.useState(false);

  const [timeline, setTimeline] = React.useState([]);

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

  function goToEscene(escene) {
    localStorage.setItem("escena", JSON.stringify(escene));
    navigate("/historia/trama/escena/info");
  }

  function goToChar(personaje) {
    localStorage.setItem("personaje", JSON.stringify(personaje));
    navigate("/personaje/info");
  }
  
  let reSinDuplicados = [];
  const handleTimeline = async () => {
    let escenas = trama.escenas;

    let personajesInvolucrados = new Set(
      escenas.flatMap((escena) => escena.personajesInvolucrados)
    );

    let promesasRelaciones = Array.from(personajesInvolucrados).map(
      (personaje) => obtenerRelaciones(personaje.id)
    );

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

    let ids = new Set();
    let lista = escenas.reduce((acumulador, escena) => {
      // Añadir la fecha y el nombre de la escena al acumulador junto con otros datos relevantes
      // Solo si escena.fecha no es null o undefined
      if (escena.fecha != null) {
        acumulador.push({
          title: convertirFecha(escena.fecha),
          orderTime: escena.fecha,
          cardTitle: (
            <Link onClick={() => goToEscene(escena)}>
              {escena.nombreEscena}
              <RemoveRedEyeIcon />
            </Link>
          ),
          cardSubtitle: escena.ubicacion
            ? "Ubicación: " + escena.ubicacion
            : "Ubicación desconocida",
          cardDetailedText: [
            <Typography
              component="h7"
              variant="h7"
              align="left"
              color="text.primary"
              gutterBottom
              key={"title"}
            >
              Información de la escena:{" "}
            </Typography>,
            <Typography key={"data"}>
              {" "}
              {escena.descripcion ? escena.descripcion : "Sin información"}{" "}
            </Typography>,
            <Typography key={"characters"}>
              Personajes involucrados:{" "}
            </Typography>,
            escena.personajesInvolucrados &&
            escena.personajesInvolucrados.length !== 0
              ? escena.personajesInvolucrados.map((personaje) => (
                  <Chip
                    key={personaje.id}
                    avatar={<Avatar alt="avatar" src={personaje.urlIcon} />}
                    label={personaje.nombre}
                    variant="outlined"
                    clickable
                    onClick={() => goToChar(personaje)}
                  />
                ))
              : "Sin información",
              <Typography key={"end"}>
              {"⠀ \n\n"}
            </Typography>,
          ],
        });
      }
      // Añadir las fechas y los nombres de los personajes involucrados al acumulador
      for (let personaje of escena.personajesInvolucrados) {
        if (!ids.has(personaje.id)) {
          ids.add(personaje.id);
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
              cardTitle: (
                <Link onClick={() => goToChar(personaje)}>
                  {"Nacimiento de " + nombreCompleto}
                  <RemoveRedEyeIcon />
                </Link>
              ),
              cardSubtitle: personaje.genero
                ? "Genero: " + personaje.genero
                : "Genero desconocido",
              cardDetailedText: personaje.descripcion,
            });
          }
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

  const closeModal = () => {
    setShowTimeline(false);
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
    return escenas.sort(function (a, b) {
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
      setScenesFiltered(ordenarEscenasPorFecha(arcTemp.escenas));

      let { nombreTrama, fechaGlobal } = arcTemp; // desestructuración de objetos
      let datosTramaTemp = [nombreTrama, convertirFecha(fechaGlobal)];

      setDatosTrama(datosTramaTemp);
      obtenerPersonajesInvolucrados(arcTemp);
    } else {
      console.log("FATAL ERROR");
      navigate("/");
    }
  }, []);

  function obtenerPersonajesInvolucrados(trama) {
    let arr = []; // Este array contendrá todos los personajesInvolucrados de todas las escenas
    if (trama.escenas != null) {
      trama.escenas.forEach((escena) => {
        // Añadimos los personajesInvolucrados al array arr
        arr.push(...escena.personajesInvolucrados);
      });

      // Usamos Array.from con Set para eliminar los objetos duplicados
      // Usamos JSON.stringify y JSON.parse para comparar los objetos por su contenido y no por su referencia
      let unique = Array.from(new Set(arr.map(JSON.stringify))).map(JSON.parse);
      // Ahora unique contiene la lista de personajesInvolucrados sin repetir
      setPersonajesInvolucrados(unique);
    }
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
            {"¿Eliminar trama?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Seguro de que desea eliminar la trama? Esta acción no se puede
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
                <MapIcon sx={{ width: 140, height: 140 }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "left",
                    flexDirection: "column",
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
                  <div>
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
                </div>
              </div>
              {showTimeline && (
                <Modal>
                  <div
                    className="modal-content"
                    style={{
                      width: "80%",
                      backgroundColor: "white",
                      marginTop: "160vh",
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
              {datosTrama.map((tramaDato, index) => (
                <div
                  style={{ display: "flex", alignItems: "left" }}
                  key={tramaDato}
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

          <div>
            {personajesInvolucrados &&
              Array.isArray(personajesInvolucrados) &&
              !personajesInvolucrados.some((e) => e == null) &&
              personajesInvolucrados.length > 0 && (
                <div>
                  <Typography
                    component="h5"
                    variant="h6"
                    align="left"
                    color="text.primary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    Filtrar escenas por personaje
                  </Typography>

                  <FormControl sx={{ ml: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Filtrar
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={selectedFilter}
                      onChange={handleSelectorChange}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) =>
                        // Se usa JSON.parse para convertir la cadena en un objeto y accedemos al nombre
                        selected.map((s) => JSON.parse(s).nombre).join(", ")
                      }
                      MenuProps={MenuProps}
                    >
                      {personajesInvolucrados.map((personaje) => (
                        // Se usa JSON.stringify para convertir el objeto en una cadena y lo usamos como valor
                        <MenuItem
                          key={personaje.id}
                          value={JSON.stringify(personaje)}
                        >
                          <Checkbox
                            checked={
                              selectedFilter.indexOf(
                                JSON.stringify(personaje)
                              ) > -1
                            }
                          />
                          <ListItemText primary={personaje.nombre} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
          </div>
        </Box>

        <Container sx={{ py: 2 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {Array.isArray(scenesFiltered) &&
              !scenesFiltered.some((e) => e === null) &&
              scenesFiltered.map((escena, index) => (
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
                    <CardActions
                      sx={{
                        width: "100%",
                        justifyContent: "flex-end",
                        pr: 3,
                        mt: "auto",
                      }}
                    >
                      <Badge
                        badgeContent={escena.personajesInvolucrados.length}
                        color="primary"
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
