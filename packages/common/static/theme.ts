import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontSize: 20,
    fontFamily: "proxima-nova, sans-serif",
  },
  palette: {
    background: {
      default: "#232946",
      paper: "#232946",
    },
    primary: {
      main: "#eebbc3",
      light: "#b8c1ec",
      contrastText: "#232946",
    },
    secondary: {
      main: "#b8c1ec",
    },
    text: {
      primary: "#fffffe",
    },
  },
});

export default theme;
