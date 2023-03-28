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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate, Link as LinkRouter} from "react-router-dom";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import axios from "axios";
import Badge from "@mui/material/Badge";



import Navigation from "../Navigation";
import Footer from "../Footer";


const theme = createTheme();

export default function Personajes() {
  const [personajes, setPersonajes] = React.useState([]);
  const [personajesFiltrados, setPersonajesFiltrados] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [showButton, setShowButton] = React.useState(null);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = personajes.filter((personaje) =>
      personaje.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setPersonajesFiltrados(filtered);
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
    if (storedValue !== 1  || storedValue === undefined) {
      localStorage.setItem("bottomNavigationValue", 1);
    }
  }, []); 

  React.useEffect(() => {
    axios
      .get("/api/personajes")
      .then((response) => {
        setPersonajes(response.data);
        setPersonajesFiltrados(response.data);
        setShowButton(true);
      })
      .catch((error) => {
        console.error(error);
      });
    localStorage.removeItem("personaje");
  }, []);

  const navigate = useNavigate();

  function handleClick(index) {
    var personajeGuardado = JSON.stringify(personajes[index]);
    localStorage.setItem("personaje", personajeGuardado);
    setTimeout(navigate("/personaje/info"), 20);
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
          </Container>
        </Box>
        <Container sx={{ py: 1 }} maxWidth="md">
          {/* End hero unit */}
          {(!personajesFiltrados || personajesFiltrados.length === 0) && showButton && (
            <Grid container spacing={4} justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
              >  <LinkRouter style={{color: '#FFF', textDecoration: 'none'}} to="/personajes/new">¡Crea tu personaje!</LinkRouter>
              </Button>
            </Grid>
          )}
          {personajesFiltrados && personajesFiltrados.length !== 0 && showButton && (
            <Grid container spacing={4} justifyContent="center"sx={{ pb: 4 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
              >  <LinkRouter style={{color: '#FFF', textDecoration: 'none'}} to="/personajes/new">Crea un personaje</LinkRouter>
              </Button>
            </Grid>
          )}
          <Grid container spacing={4}>
            {personajesFiltrados.map((personaje, index) => (
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
                      avatar={<Avatar alt="Apple" src={personaje.urlIcon} />}
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
                    <Badge badgeContent={personaje.numEscenas} color="primary">
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
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
