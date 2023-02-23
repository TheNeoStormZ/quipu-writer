const React = require("react");
const ReactDOM = require("react-dom/client");
import SearchIcon from "@mui/icons-material/Search";
import {
  Card, CardActionArea, CardActions,
  CardContent, CardHeader
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Navigation from "./Navigation";

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

export default function Personajes() {
  const [personajes, setPersonajes] = React.useState([]);
  const [personajesFiltrados, setPersonajesFiltrados] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = personajes.filter((personaje) =>
      personaje.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setPersonajesFiltrados(filtered);
  };

  React.useEffect(() => {
    axios
      .get("/api/personajes")
      .then((response) => {
        setPersonajes(response.data);
        setPersonajesFiltrados(response.data);
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
    setTimeout(navigate("/personaje/info"),20);
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
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
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
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
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
