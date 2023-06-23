const React = require("react");
const ReactDOM = require("react-dom/client");
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import Badge from "@mui/material/Badge";

import BookIcon from "@mui/icons-material/Book";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import MapIcon from "@mui/icons-material/Map";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import axios from "axios";

import Navigation from "./Navigation";

import Footer from "./Footer";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

const theme = createTheme();

export default function Historias() {
  const [historias, setHistorias] = React.useState([]);

  const [historiasCat, setHistoriasCat] = React.useState([]);

  const [generosHistorias, setGenerosHistorias] = React.useState([]);

  const [historiasFiltradas, setHistoriasFiltradas] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [showButton, setShowButton] = React.useState(null);

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

    const filtered = historiasCat.filter((historia) =>
      // dividir la consulta por espacios
      query
        .split(" ")
        .every(
          (palabra) =>
            historia.nombreHistoria
              .toLowerCase()
              .includes(palabra.toLowerCase()) ||
            historia.descripcion.toLowerCase().includes(palabra.toLowerCase())
        )
    );
    setHistoriasFiltradas(filtered);
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

    let resultado = historias;

    if (seccionesElegidas.length > 0) {
      resultado = historias.filter((historia) =>
      // Comprueba si la lista de géneros de la historia es subconjunto de seccionesElegidas usando una función flecha
      seccionesElegidas.every((g) => historia.generos.includes(g)) && historia.generos && historia.generos.length > 0 );
     
    }
    console.log(resultado);
    setHistoriasCat(resultado);
    setHistoriasFiltradas(resultado);
  };

  const handleImportInit = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = JSON.parse(event.target.result);
      console.log(fileContent);
      handleSend(fileContent);
    };
    reader.readAsText(file);
  };

  const fileInput = React.useRef(null);

  const handleSend = (fileContent) => {
    console.log(fileContent);
    axios
      .post("/api/historias/import", fileContent, {
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
    axios
      .get("/api/historias")
      .then((response) => {
        setHistorias(response.data);
        setHistoriasCat(response.data);
        setHistoriasFiltradas(response.data);
        setShowButton(true);
      })
      .catch((error) => {
        console.error(error);
      });
    localStorage.removeItem("historia");
  }, []);

  React.useEffect(() => {
    axios
      .get("/api/historias/generos")
      .then((response) => {
        setGenerosHistorias(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const navigate = useNavigate();

  function handleClick(index) {
    let historiaGuardado = JSON.stringify(historias[index]);
    localStorage.setItem("historia", historiaGuardado);
    setTimeout(navigate("/historia/info"), 20);
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
              Historias
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
              {historias && historias.length !== 0 && showButton && (
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
                  renderValue={(selected) =>
                    // No hace falta usar JSON.parse, solo unir los valores con una coma
                    selected.join(", ")
                  }
                  MenuProps={MenuProps}
                >
                  {generosHistorias.map((genero) => (
                    // No hace falta usar JSON.stringify, solo usar el valor del género
                    <MenuItem key={genero.id} value={genero}>
                      <Checkbox checked={seccionName.indexOf(genero) > -1} />
                      <ListItemText primary={genero} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>)}
            </div>
          </Container>
        </Box>
        <Container sx={{ py: 1 }} maxWidth="md">
          {(!historiasFiltradas || historiasFiltradas.length === 0) &&
            showButton && (
              <Grid container spacing={4} justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<LibraryAddIcon />}
                >
                  {" "}
                  <LinkRouter
                    style={{ color: "#FFF", textDecoration: "none" }}
                    to="/historias/new"
                  >
                    ¡Crea tu historia!
                  </LinkRouter>
                </Button>
              </Grid>
            )}
          {historiasFiltradas &&
            historiasFiltradas.length !== 0 &&
            showButton && (
              <Grid
                container
                spacing={4}
                justifyContent="center"
                sx={{ pb: 4 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<LibraryAddIcon />}
                >
                  {" "}
                  <LinkRouter
                    style={{ color: "#FFF", textDecoration: "none" }}
                    to="/historias/new"
                  >
                    Crea una historia nueva
                  </LinkRouter>
                </Button>
              </Grid>
            )}
          {/* End hero unit */}
          <Grid container spacing={4}>
            {historiasFiltradas.map((historia, index) => (
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
