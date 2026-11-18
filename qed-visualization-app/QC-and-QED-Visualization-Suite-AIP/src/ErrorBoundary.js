// src/ErrorBoundary.js

import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';

/**
 * ErrorBoundary Component
 *
 * This component acts as an error boundary for the React component tree.
 * If any child component throws an error, this boundary will catch it,
 * log it, and display a fallback UI to inform the user.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred
    this.state = { hasError: false, errorInfo: null };
  }

  /**
   * getDerivedStateFromError
   *
   * Updates the state when an error is thrown to trigger a fallback UI.
   * @param {Error} error - The error that was thrown.
   * @returns {object} Updated state with error details.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error };
  }

  /**
   * componentDidCatch
   *
   * Logs the error information to an error reporting service if needed.
   * @param {Error} error - The error that was thrown.
   * @param {object} info - Additional error information.
   */
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
    // You can also send error details to an error reporting service here.
  }

  /**
   * handleReload
   *
   * Reloads the current page when the user clicks the "Reload" button.
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI for when an error has been caught
      return (
        <Box sx={{ m: 2 }}>
          <Alert severity="error" variant="filled">
            <AlertTitle>Error</AlertTitle>
            <strong>Something went wrong.</strong> Please try refreshing the page.
            {this.state.errorInfo && (
              <Box mt={1} fontSize="0.875rem">
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo.toString()}
                </details>
              </Box>
            )}
            <Box mt={2}>
              <Button variant="contained" color="secondary" onClick={this.handleReload}>
                Reload Page
              </Button>
            </Box>
          </Alert>
        </Box>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
