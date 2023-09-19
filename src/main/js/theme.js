import { red, lightBlue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
const React = require("react");

// A custom theme for this app

export default function createDarkTheme(toggleDark) {
  const theme = createTheme({
    palette: {
      mode: toggleDark ? "dark" : "light", // Usar la variable del modo como valor
      primary: {
        main: '#1565c0',
      },
      secondary: {
        main: '#3d5a80',
      },
      error: {
        main: red.A400,
      },
    },
    
  });
  return theme;
}

export {createDarkTheme}