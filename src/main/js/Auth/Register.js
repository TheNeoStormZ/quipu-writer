const React = require("react");
const ReactDOM = require("react-dom/client");
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
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
var message = "ERROR — check it out!";

export default function Register() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var password = data.get("password");
    var conf_password = data.get("conf_password");
    if (password != conf_password) {
      alert("La contraseña no coincide");
    } else {
      try {
        await axios.post("api/auth/register", {
          username: data.get("username"),
          email: data.get("email"),
          password: data.get("password"),
        });
        window.location.href = "/login";
      } catch (err) {
        message = err.response.data;
        setShowAlert(true);
      }
    }
  };
  const [showAlert, setShowAlert] = React.useState(false);
  const AlertCustom = () => (
    <Alert variant="outlined" severity="error" sx={{ m: 2 }}>
      {message}
    </Alert>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registro
          </Typography>
          {showAlert ? <AlertCustom /> : null}
          <Box component="form" onSubmit={handleSubmit} z sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="Correo electronico"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="conf_password"
              label="Confirmar contraseña"
              type="password"
              id="conf_password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Resgitrarme
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Iniciar sesión"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
