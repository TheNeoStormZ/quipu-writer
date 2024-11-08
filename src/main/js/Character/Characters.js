const React = require("react");
const ReactDOM = require("react-dom/client");
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import SearchIcon from "@mui/icons-material/Search";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import DataTable from "./CharacterTable";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import Badge from "@mui/material/Badge";
import axios from "axios";

import Footer from "../Footer";
import Navigation from "../Navigation";
import Modal from "../Utils/Modal";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

const theme = createTheme();

export default function Personajes() {
  const [personajes, setPersonajes] = React.useState([]);

  const [personajesFiltradoCatOG, setPersonajesFiltradoCatOG] = React.useState(
    []
  );

  const [personajesFiltradoCat, setPersonajesFiltradoCat] = React.useState([]);

  const [personajesPorSecciones, setPersonajesPorSecciones] = React.useState(
    {}
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const [showButton, setShowButton] = React.useState(null);

  const [showDBSearch, setShowDBSearch] = React.useState(false);

  const [showDBResults, setShowDBResults] = React.useState(false);

  const [dBResults, setDBResults] = React.useState([]);

  const [seccionName, setSeccionName] = React.useState([]);

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

  const handleSearchChange = (event) => {
    let query = event.target.value;
    setSearchQuery(query);
    query = query.trim();
    if (seccionName.length > 0) {
      const filtered = personajesFiltradoCatOG.filter(
        (personaje) =>
        // dividir la consulta por espacios
        query.split(" ").every(
         // comprobar si alguna palabra está incluida en algún campo
         (palabra) =>
          personaje.nombre.toLowerCase().startsWith(palabra.toLowerCase()) ||
          personaje.primerApellido.toLowerCase().startsWith(palabra.toLowerCase()) ||
          personaje.segundoApellido.toLowerCase().startsWith(palabra.toLowerCase()) ||
          personaje.residencia.toLowerCase().includes(palabra.toLowerCase()) ||
          personaje.genero.toLowerCase().includes(palabra.toLowerCase()) ||
          personaje.descripcion.toLowerCase().includes(palabra.toLowerCase())
        )
      );
      setPersonajesFiltradoCat(filtered);
    } else {
      const filtered = personajes.filter(
        (personaje) =>
        // dividir la consulta por espacios
        query.split(" ").every(
         // comprobar si alguna palabra está incluida en algún campo
         (palabra) =>
          personaje.nombre.toLowerCase().startsWith(palabra.toLowerCase()) ||
          personaje.primerApellido.toLowerCase().startsWith(palabra.toLowerCase()) ||
          personaje.segundoApellido.toLowerCase().startsWith(palabra.toLowerCase()) ||
          personaje.residencia.toLowerCase().includes(palabra.toLowerCase()) ||
          personaje.genero.toLowerCase().includes(palabra.toLowerCase()) ||
          personaje.descripcion.toLowerCase().includes(palabra.toLowerCase())
        )
      );
      generarSeccionesPersonajes(filtered);
    }
  };

  const handleSearchDBPedia = (event) => {
    let query = document.getElementById("dbpedia-search").value;
    query = query.split(" ").join("+");
    axios
      .get(
        "https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0ASELECT+DISTINCT+%3Fnombre+%3Fapellidos+%3Fgenero+%3Fresidencia+%3Faltura+%3FfechaValida+%3FlugarNacimiento+%3Fdescripcion%0D%0AWHERE+%7B%0D%0A++%3Fpersona+foaf%3Aname+%3Fnombre+.%0D%0A++FILTER+regex%28%3Fnombre%2C+%22" +
          query +
          "%22%2C+%22i%22%29+.%0D%0A++OPTIONAL+%7B+%3Fpersona+foaf%3Asurname+%3Fapellidos+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbp%3Agender+%3Fgenero+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbo%3Aresidence+%3Fresidencia+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbo%3Aheight+%3Faltura+.+%7D%0D%0AOPTIONAL+%7B+%3Fpersona+dbp%3Aorigin+%3FlugarNacimiento+.+%7D%0D%0A++OPTIONAL+%7B+%0D%0A++++%3Fpersona+dbp%3Adata+%3FfechaNacimiento+.%0D%0A++++BIND%28IF%28STR%28%3FfechaNacimiento%29+%3D+REGEX%28STR%28%3FfechaNacimiento%29%2C+%22%5E%28%5C%5Cd%7B4%7D-%5C%5Cd%7B2%7D-%5C%5Cd%7B2%7D%7C%5C%5Cd%7B2%7D-%5C%5Cd%7B2%7D-%5C%5Cd%7B4%7D%7C%29%24%22%29%2C+%3FfechaNacimiento%2C+UNDEF%29+AS+%3FfechaValida%29%0D%0A++%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbo%3Aabstract+%3Fdescripcion+.%0D%0A+++++++++++++FILTER+%28lang%28%3Fdescripcion%29+%3D+%22en%22+%7C%7C+lang%28%3Fdescripcion%29+%3D+%22es%22%29+.%0D%0A+++++++++++%7D%0D%0A++%3Fpersona+dbo%3AwikiPageID+%3Fid+.%0D%0A++%3Fpersona+a%2Frdfs%3AsubClassOf*+dbo%3AFictionalCharacter+.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=10000&signal_void=on&signal_unconnected=on"
      )
      .then((response) => {
        setDBResults(response.data.results.bindings);
        setShowDBResults(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSelectorChange = (event) => {
    const {
      target: { value },
    } = event;

    let seccionesElegidas =
      typeof value === "string" ? value.split(",") : value;
    console.log(seccionesElegidas);
    setSeccionName(seccionesElegidas);
    setSearchQuery("");

    let resultado = seccionesElegidas.map((sec) => personajesPorSecciones[sec]);

    resultado = [...new Set(resultado.flat())];

    console.log(resultado);

    setPersonajesFiltradoCat(resultado);
  };

  const handleImportInit = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = JSON.parse(event.target.result);
      handleSend(fileContent);
    };
    reader.readAsText(file);
  };

  const fileInput = React.useRef(null);

  const handleSend = (fileContent) => {
    axios
      .post("/api/personajes/import", fileContent, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        location.reload();
      })
      .catch((error) => console.error(error));
  };

  React.useEffect(() => {
    const storedValue = localStorage.getItem("bottomNavigationValue");
    if (storedValue !== 1 || storedValue === undefined) {
      localStorage.setItem("bottomNavigationValue", 1);
    }
  }, []);

  React.useEffect(() => {
    axios
      .get("/api/personajes")
      .then((response) => {
        setPersonajes(response.data);
        setPersonajesFiltradoCat(response.data);
        setPersonajesFiltradoCatOG(response.data);
        generarSeccionesPersonajes(response.data);
        setShowButton(true);
      })
      .catch((error) => {
        console.error(error);
      });
    localStorage.removeItem("personaje");
  }, []);

  const navigate = useNavigate();

  function handleClick(personaje) {
    let personajeGuardado = JSON.stringify(personaje);
    localStorage.setItem("personaje", personajeGuardado);
    setTimeout(navigate("/personaje/info"), 20);
  }

  const closeModal = () => {
    setShowDBSearch(false);
  };

  function generarSeccionesPersonajes(personajes) {
    // Este es el objeto vacío que almacena las secciones
    let secciones = {};

    // Este es el map() que recorre el array de personajes
    personajes.map((personaje) => {
      let historiasApariciones = personaje.historiasApariciones.filter(
        function (val) {
          return val != null;
        }
      );

      // Compruebo si el personaje tiene alguna historia
      if (historiasApariciones.length === 0) {
        // Si no tiene ninguna, lo añado a la sección "Sin clasificar"
        if (!secciones["Sin clasificar"]) {
          // Si la sección "Sin clasificar" no existe, la creo y le asigno un array vacío
          secciones["Sin clasificar"] = [];
        }
        // Añado el personaje al array de la sección "Sin clasificar"
        secciones["Sin clasificar"].push(personaje);
      } else {
        // Si tiene alguna historia, recorro el array de historiasApariciones
        historiasApariciones.map((historia) => {
          if (historia != null) {
            // Compruebo si existe una sección con el mismo nombre que la historia
            if (!secciones[historia.nombreHistoria]) {
              // Si no existe, la creo y le asigno un Set vacío
              secciones[historia.nombreHistoria] = new Set();
            }
            // Añado el personaje al Set de la sección correspondiente
            secciones[historia.nombreHistoria].add(personaje);
          }
        });
      }
    });

    // Convierto los Sets en arrays para mantener el formato original
    for (let seccion in secciones) {
      secciones[seccion] = [...secciones[seccion]];
    }

    setPersonajesPorSecciones(secciones);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Personajes
              <input
                type="file"
                id="file"
                accept="application/json"
                onChange={handleImportInit}
                ref={fileInput}
                style={{ display: "none" }}
              />
              <IconButton
                aria-label="import"
                onClick={() => fileInput.current.click()}
              >
                <CloudUploadIcon />
              </IconButton>
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              ¡Esta pagina esta en construcción!
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            ></Stack>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <TextField
                label="Buscar"
                value={searchQuery}
                fullWidth
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {personajes && personajes.length !== 0 && showButton && (
                <FormControl sx={{ ml: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Filtrar
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={seccionName}
                    onChange={handleSelectorChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {Object.keys(personajesPorSecciones).map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={seccionName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          </Container>
        </Box>
        <Container sx={{ py: 1 }} maxWidth="md">
          <Grid
            container
            spacing={1}
            justifyContent="center"
            sx={{ pb: 4, ml: 0 }}
          >
            {/* End hero unit */}
            {(!personajes || personajes.length === 0) && showButton && (
              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
              >
                {" "}
                <LinkRouter
                  style={{ color: "#FFF", textDecoration: "none" }}
                  to="/personajes/new"
                >
                  ¡Crea tu personaje!
                </LinkRouter>
              </Button>
            )}
            {personajes && personajes.length !== 0 && showButton && (
              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
              >
                {" "}
                <LinkRouter
                  style={{ color: "#FFF", textDecoration: "none" }}
                  to="/personajes/new"
                >
                  Crea un personaje
                </LinkRouter>
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={<TravelExploreIcon />}
              sx={{ ml: 1 }}
              onClick={() => setShowDBSearch(true)}
            >
              Importar de DBPedia
            </Button>
            {showDBSearch && (
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
                    Importar de DBPedia
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

                  <TextField
                    label="Buscar"
                    fullWidth
                    id="dbpedia-search"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {showDBResults && (
                    <div
                      style={{
                        backgroundColor: "white",
                        overflowY: "scroll",
                        boxSizing: "border-box",
                      }}
                    >
                      <DataTable data={dBResults} />
                    </div>
                  )}

                  <Button
                    variant="contained"
                    sx={{ mt: 2, mr: 2 }}
                    onClick={handleSearchDBPedia}
                    startIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>

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
          </Grid>
          <Grid container>
            {seccionName.length == 0 &&
              Object.keys(personajesPorSecciones).map((seccion) => (
                <>
                  <Typography variant="h5" color="text.primary" paragraph>
                    {seccion}
                  </Typography>
                  <Grid container spacing={4} sx={{ pb: 2 }}>
                    {personajesPorSecciones[seccion].map((personaje) => (
                      <Grid item key={personaje.id} xs={12} sm={6} md={4}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardActionArea
                            onClick={() => handleClick(personaje)}
                          >
                            <CardHeader
                              avatar={
                                <Avatar alt="avatar" src={personaje.urlIcon} />
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
                          <CardActions
                            sx={{
                              width: "100%",
                              justifyContent: "flex-end",
                              pr: 3,
                              mt: "auto",
                            }}
                          >
                            <Badge
                              badgeContent={personaje.numEscenas}
                              color="primary"
                            >
                              <FilterHdrIcon color="action" />
                            </Badge>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ))}
            {seccionName.length > 0 ? (
              <Grid container spacing={4} sx={{ pb: 2 }}>
                {personajesFiltradoCat.map((personaje, index) => (
                  <Grid item key={personaje.id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardActionArea onClick={() => handleClick(personaje)}>
                        <CardHeader
                          avatar={
                            <Avatar alt="avatar" src={personaje.urlIcon} />
                          }
                        />

                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {personaje.nombre}
                          </Typography>
                          <Typography>{personaje.descripcion}</Typography>
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
                          badgeContent={personaje.numEscenas}
                          color="primary"
                        >
                          <FilterHdrIcon color="action" />
                        </Badge>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </ThemeProvider>
  );
}
