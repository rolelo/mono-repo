import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#008394",
      dark: "#008394",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4569",
      main: "#b2102f",
      dark: "#b2102f",
      contrastText: "#fff",
    },
  },
});

export default theme;
