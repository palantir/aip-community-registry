// src/App.js

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import QEDVisualization from './components/QEDVisualization';
import ErrorBoundary from './ErrorBoundary';

// Create a custom theme using Material-UI's createTheme function.
// This theme customizes the primary/secondary colors, background color, and typography.
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#ff6f00',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    // React.StrictMode helps with highlighting potential issues in an app during development.
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstarts a consistent baseline for styling across browsers */}
        <CssBaseline />
        {/* ErrorBoundary catches any errors in the component tree and displays a fallback UI */}
        <ErrorBoundary>
          <QEDVisualization />
        </ErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
