import { red, lightBlue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: lightBlue[300],
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;