// src/components/DensityMatrixVisualization.js

import React, { useState } from 'react';
import { Typography, Box, Button, Paper, Slider } from '@mui/material';

// Define the initial density matrix state for a qubit.
const initialDensityMatrix = [
  [1, 0],
  [0, 0],
];

/**
 * DensityMatrixVisualization Component
 *
 * This component visualizes the density matrix of a qubit state.
 * It allows the user to simulate decoherence by gradually reducing the off-diagonal
 * elements based on a selected decoherence factor. The user can reset the matrix to
 * its initial state. A brief explanation of the density matrix is provided.
 */
const DensityMatrixVisualization = () => {
  // State to hold the current density matrix.
  const [densityMatrix, setDensityMatrix] = useState(initialDensityMatrix);
  // State to control the decoherence factor (0 = no decoherence, 1 = full decoherence).
  const [decoherenceFactor, setDecoherenceFactor] = useState(1);

  /**
   * applyPartialDecoherence function
   *
   * Simulates partial decoherence by scaling down the off-diagonal elements.
   * When the decoherence factor is 1, the off-diagonals are fully removed.
   * When the decoherence factor is 0, the density matrix remains unchanged.
   */
  const applyPartialDecoherence = () => {
    setDensityMatrix([
      [densityMatrix[0][0], densityMatrix[0][1] * (1 - decoherenceFactor)],
      [densityMatrix[1][0] * (1 - decoherenceFactor), densityMatrix[1][1]],
    ]);
  };

  /**
   * resetDensityMatrix function
   *
   * Resets the density matrix and decoherence factor back to their initial states.
   */
  const resetDensityMatrix = () => {
    setDensityMatrix(initialDensityMatrix);
    setDecoherenceFactor(1);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Title and Explanation */}
      <Typography variant="h6" gutterBottom>
        Density Matrix Visualization
      </Typography>
      <Typography paragraph>
        In quantum mechanics, the density matrix represents the state of a quantum system,
        including statistical mixtures of states. The off-diagonal elements measure the coherence
        between the basis states. Here, you can simulate decoherence, which reduces these off-diagonals.
      </Typography>

      {/* Controls for Decoherence Simulation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary" onClick={applyPartialDecoherence}>
            Apply Partial Decoherence
          </Button>
          <Button variant="outlined" color="primary" onClick={resetDensityMatrix}>
            Reset
          </Button>
        </Box>

        <Box sx={{ width: '300px', mt: 1 }}>
          <Typography gutterBottom>
            Decoherence Level: {(decoherenceFactor * 100).toFixed(0)}%
          </Typography>
          <Slider
            value={decoherenceFactor}
            onChange={(event, newValue) => setDecoherenceFactor(newValue)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="decoherence-slider"
          />
        </Box>
      </Box>

      {/* Display the Current Density Matrix */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Density Matrix:
        </Typography>
        <pre style={{ textAlign: 'left', margin: 0, fontSize: '1rem' }}>
          {`[ [${densityMatrix[0][0]}, ${densityMatrix[0][1]}],
  [${densityMatrix[1][0]}, ${densityMatrix[1][1]}] ]`}
        </pre>
      </Paper>
    </Box>
  );
};

export default DensityMatrixVisualization;
