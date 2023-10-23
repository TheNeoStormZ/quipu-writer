const React = require("react");
const ReactDOM = require("react-dom/client");
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Paper,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import BookIcon from "@mui/icons-material/Book";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Badge from "@mui/material/Badge";

import MapIcon from "@mui/icons-material/Map";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import Chip from "@mui/material/Chip";

import Modal from '@mui/material/Modal';

import axios from "axios";

import CloseIcon from "@mui/icons-material/Close";

function PersonajeModal(props) {
  const personaje = removeEmpty(props.data);

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

  const [datosPersonaje, setDatosPersonaje] = React.useState([]);

  const [historiasApariciones, setHistoriasApariciones] = React.useState([]);

  const [personajesRelacionados, setPersonajesRelacionados] = React.useState(
    []
  );

  function handleClick(index) {
    let historiaGuardado = JSON.stringify(historiasApariciones[index]);
    localStorage.setItem("historia", historiaGuardado);
    setTimeout(navigate("/historia/info"), 20);
  }

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
    if (personaje) {
      if (personaje.historiasApariciones != null) {
        let historiasApariciones = personaje.historiasApariciones.filter(
          function (val) {
            return val != null;
          }
        );
        setHistoriasApariciones(historiasApariciones);
      }
      handleRelations(personaje.id);

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
        Object.keys(personaje)
          .filter((key) => !keysExcluidas.includes(key))
          .reduce((obj, key) => {
            obj[key] = personaje[key];
            // Si la propiedad es fechaNacimiento y no es undefined, aplicar la función convertirFecha
            key === "fechaNacimiento" &&
              (obj[key] = convertirFecha(personaje[key]));
            // Si la propiedad es altura y no es undefined, añadir el sufijo " cm"
            key === "altura" && (obj[key] = personaje[key] + " cm");
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
    <Modal
      open={props.data}
      onClose={() => props.updatePersonajeDato(null)}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxWidth: '100vw',
        maxHeight: '100vh',
        overflowY: "auto",
      }}
      >
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
              </div>
              {datosPersonaje.map(([nombreDato, personajeDato], index) => (
                <div
                  style={{ display: "flex", alignItems: "left" }}
                  key={personajeDato + personajeDato}
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
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={() => props.updatePersonajeDato(null)}
          startIcon={<CloseIcon />}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}

export default PersonajeModal;
