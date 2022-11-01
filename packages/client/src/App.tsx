import React from 'react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from './components/routes';

import theme from 'common/static/theme';
import 'common/styles/App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
