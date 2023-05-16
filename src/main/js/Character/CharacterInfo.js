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
  CardHeader,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import BookIcon from "@mui/icons-material/Book";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Badge from "@mui/material/Badge";

import MapIcon from "@mui/icons-material/Map";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import Chip from "@mui/material/Chip";

import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import Modal from "../Utils/Modal";
import DataTable from "./Relationships/RelationshipTable";

import GroupWorkIcon from "@mui/icons-material/GroupWork";

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

export default function Personaje() {
  const personajeStr = localStorage.getItem("personaje");
  const [datosPersonaje, setDatosPersonaje] = React.useState([]);
  const [personaje, setPersonaje] = React.useState([]);
  const [openExportAlert, setOpenExportAlert] = React.useState(false);
  const [openExportFailAlert, setOpenExportFailAlert] = React.useState(false);
  let personajeTemp = personajeStr;

  const [openDelete, setOpenDelete] = React.useState(false);

  const [historiasApariciones, setHistoriasApariciones] = React.useState([]);

  const [dataRelations, setDataRelations] = React.useState([]);

  const [personajesRelacionados, setPersonajesRelacionados] = React.useState(
    []
  );

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const [showListRel, setShowListRel] = React.useState(false);

  const closeModalRelations = () => {
    setShowListRel(false);
  };
  const openModalRelations = () => {
    axios
      .get("/api/personajes/relaciones/" + personaje.id + "/detailed")
      .then((response) => {
        setDataRelations(response.data);
      })

      .catch((error) => {
        console.log(error);
      });
    setShowListRel(true);
  };

  function handleClick(index) {
    let historiaGuardado = JSON.stringify(historiasApariciones[index]);
    localStorage.setItem("historia", historiaGuardado);
    setTimeout(navigate("/historia/info"), 20);
  }

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

  function handleRelations(personajeId) {
    axios
      .get("/api/personajes/relaciones/" + personajeId)
      .then((response) => {
        setPersonajesRelacionados(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const navigate = useNavigate();

  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => Boolean(v) && !(Array.isArray(v) && v.length === 0)
      )
    );
  }

  function orderKeys(personaje) {
    // Crear un array con los nombres de las propiedades en el orden deseado
    let orden = [
      "Primer Apellido",
      "Segundo Apellido",
      "Género",
      "Residencia",
      "Altura",
      "Fecha de Nacimiento",
      "Lugar de Nacimiento",
    ];

    // Crear un nuevo objeto vacío
    let nuevo = {};

    // Recorrer el array y asignar las propiedades del objeto datos al nuevo objeto usando el índice del array
    for (const element of orden) {
      let propiedad = element;
      switch (propiedad) {
        case "Altura":
          nuevo[propiedad] = personaje["altura"];
          break;
        case "Fecha de Nacimiento":
          nuevo[propiedad] = personaje["fechaNacimiento"];
          break;
        case "Género":
          nuevo[propiedad] = personaje["genero"];
          break;
        case "Lugar de Nacimiento":
          nuevo[propiedad] = personaje["lugarNacimiento"];
          break;
        case "Primer Apellido":
          nuevo[propiedad] = personaje["primerApellido"];
          break;
        case "Residencia":
          nuevo[propiedad] = personaje["residencia"];
          break;
        case "Segundo Apellido":
          nuevo[propiedad] = personaje["segundoApellido"];
          break;
      }
    }

    // Devolver el nuevo objeto
    return Object.entries(nuevo).filter(([clave, valor]) => {
      // Devolver true si el valor no es nulo ni vacío
      return valor != null && valor != "";
    });
  }

  React.useEffect(() => {
    if (personajeStr) {
      personajeTemp = removeEmpty(JSON.parse(personajeStr));
      console.log(personajeTemp);
      setPersonaje(personajeTemp);
      if (personajeTemp.historiasApariciones != null) {
        let historiasApariciones = personajeTemp.historiasApariciones.filter(
          function (val) {
            return val != null;
          }
        );
        
        setHistoriasApariciones(historiasApariciones);
      }
      handleRelations(personajeTemp.id);

      // Creamos un array con las keys que queremos excluir del objeto
      let keysExcluidas = [
        "creador",
        "id",
        "nombre",
        "descripcion",
        "urlIcon",
        "numEscenas",
        "historiasApariciones",
      ];

      let datosPersonajeTemp = [
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
      datosPersonajeTemp = orderKeys(datosPersonajeTemp[0]);
      setDatosPersonaje(datosPersonajeTemp);
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
        {showListRel && (
          <Modal>
            <div
              className="modal-content"
              style={{
                width: "80%",
                maxHeight: "80%",
                marginTop: "20vh",
                marginBottom: "10vh",
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
                Relaciones
              </Typography>
              <DataTable data={dataRelations} />
              <Button
                variant="contained"
                color="error"
                onClick={closeModalRelations}
                sx={{ mt: 2 }}
                startIcon={<CloseIcon />}
              >
                Cerrar
              </Button>
            </div>
          </Modal>
        )}

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
              <div>
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2, ml: 2 }}
                  gutterBottom
                >
                  Personajes relacionados
                </Typography>
                {personajesRelacionados &&
                  personajesRelacionados.length !== 0 &&
                  personajesRelacionados.map((personaje, index) => (
                    <Chip
                      key={personaje.id}
                      avatar={<Avatar alt="avatar" src={personaje.urlIcon} />}
                      label={personaje.nombre}
                      variant="outlined"
                    />
                  ))}
                <IconButton aria-label="relation">
                  <LinkRouter to="/personaje/relaciones/add">
                    {" "}
                    <GroupAddIcon />
                  </LinkRouter>
                </IconButton>
                {personajesRelacionados &&
                  personajesRelacionados.length !== 0 && (
                    <>
                      <IconButton aria-label="relationDel">
                        <GroupRemoveIcon onClick={openModalRelations} />
                      </IconButton>
                      <IconButton aria-label="relationGraph">
                        <LinkRouter to="/personaje/relaciones/graph">
                          {" "}
                          <GroupWorkIcon></GroupWorkIcon>
                        </LinkRouter>
                      </IconButton>
                    </>
                  )}
              </div>
              {datosPersonaje.map(([nombreDato, personajeDato], index) => (
                <div
                  style={{ display: "flex", alignItems: "left" }}
                  key={personajeDato+personajeDato}
                >
                  <Typography
                    component="h3"
                    variant="h5"
                    align="left"
                    color="text.primary"
                    sx={{ mt: 2, ml: 2 }}
                    gutterBottom
                  >
                    {nombreDato}
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
            {historiasApariciones &&
              Array.isArray(historiasApariciones) &&
              historiasApariciones.length !== 0 && (
                <Typography
                  component="h3"
                  variant="h5"
                  align="left"
                  color="text.primary"
                  sx={{ mt: 2 }}
                  gutterBottom
                >
                  Aparece en:
                </Typography>
              )}
          </div>
        </Box>
        <Container sx={{ py: 2 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {Array.isArray(historiasApariciones) &&
              !historiasApariciones.some((e) => e == null) &&
              historiasApariciones.map((historia, index) => (
                <Grid item key={historia.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea onClick={() => handleClick(index)}>
                      <CardHeader avatar={<BookIcon />} />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {historia.nombreHistoria}
                        </Typography>
                        <Typography>{historia.descripcion}</Typography>
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
                        badgeContent={historia.tramas.length}
                        color="primary"
                      >
                        <MapIcon color="action" />
                      </Badge>
                      <Badge
                        badgeContent={historia.numPersonajes}
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
