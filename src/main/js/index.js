const React = require("react");
const ReactDOM = require("react-dom/client");
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader
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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MapIcon from "@mui/icons-material/Map";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import axios from "axios";

import Navigation from "./Navigation";

import Footer from "./Footer";



const theme = createTheme();

export default function Historias() {
  const [historias, setHistorias] = React.useState([]);
  const [historiasFiltradas, setHistoriasFiltradas] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [showButton, setShowButton] = React.useState(null);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = historias.filter((historia) =>
      historia.nombreHistoria.toLowerCase().includes(query.toLowerCase())
    );
    setHistoriasFiltradas(filtered);
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
        setHistoriasFiltradas(response.data);
        setShowButton(true);
      })
      .catch((error) => {
        console.error(error);
      });
    localStorage.removeItem("historia");
  }, []);

  const navigate = useNavigate();

  function handleClick(index) {
    var historiaGuardado = JSON.stringify(historias[index]);
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
        {(!historiasFiltradas || historiasFiltradas.length === 0) && showButton && (
            <Grid container spacing={4} justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                startIcon={<LibraryAddIcon />}
              >  <LinkRouter style={{color: '#FFF', textDecoration: 'none'}} to="/historias/new">¡Crea tu historia!</LinkRouter>
              </Button>
            </Grid>
          )}
          {historiasFiltradas && historiasFiltradas.length !== 0 && showButton && (
             <Grid container spacing={4} justifyContent="center" sx={{ pb: 4 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<LibraryAddIcon />}
              >  <LinkRouter style={{color: '#FFF', textDecoration: 'none'}} to="/historias/new">Crea una historia nueva</LinkRouter>
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
      <Footer/>
      {/* End footer */}
    </ThemeProvider>
  );
}
