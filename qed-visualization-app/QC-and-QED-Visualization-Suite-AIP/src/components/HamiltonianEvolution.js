// src/components/HamiltonianEvolution.js

import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import { multiply, exp, i } from 'mathjs';

const HamiltonianEvolution = () => {
  // Time for evolution (t)
  const [time, setTime] = useState(0);
  // Quantum state vector; initially set to [1, 0]
  const [state, setState] = useState([1, 0]);
  // Hamiltonian matrix (2x2) for the evolution; initial value is the Pauli-X matrix
  const [hamiltonian, setHamiltonian] = useState([
    [0, 1],
    [1, 0],
  ]);

  /**
   * evolveState function
   *
   * Computes the time evolution of the quantum state under the Hamiltonian.
   * It calculates the evolution operator U = exp(-i * H * t) and applies it to the state.
   */
  const evolveState = () => {
    const H = hamiltonian;
    const t = time;
    const U = [
      [
        exp(multiply(multiply(-i, H[0][0]), t)),
        exp(multiply(multiply(-i, H[0][1]), t)),
      ],
      [
        exp(multiply(multiply(-i, H[1][0]), t)),
        exp(multiply(multiply(-i, H[1][1]), t)),
      ],
    ];

    const newState = multiply(U, state);
    setState(newState);
  };

  /**
   * handleTimeChange function
   *
   * Updates the simulation time as the user modifies the input.
   */
  const handleTimeChange = (event) => {
    setTime(parseFloat(event.target.value));
  };

  /**
   * handleHamiltonianChange function
   *
   * Updates a specific element of the Hamiltonian matrix.
   * @param {number} row - The row index (0 or 1)
   * @param {number} col - The column index (0 or 1)
   * @param {object} event - The change event containing the new value
   */
  const handleHamiltonianChange = (row, col, event) => {
    const newVal = parseFloat(event.target.value);
    // Create a shallow copy of the Hamiltonian matrix
    const newHamiltonian = hamiltonian.map((r) => [...r]);
    newHamiltonian[row][col] = newVal;
    setHamiltonian(newHamiltonian);
  };

  return (
    <Box>
      <Typography variant="h6">Hamiltonian Evolution</Typography>
      <Typography paragraph>
        Simulate time evolution of a quantum state under a Hamiltonian.
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Time (t)"
          type="number"
          value={time}
          onChange={handleTimeChange}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={evolveState}>
          Evolve State
        </Button>
      </Box>
      
      {/* Hamiltonian matrix input */}
      <Typography variant="subtitle1">Hamiltonian Matrix:</Typography>
      <Grid container spacing={2} sx={{ mb: 2, maxWidth: '300px' }}>
        <Grid item xs={6}>
          <TextField
            label="H[0][0]"
            type="number"
            value={hamiltonian[0][0]}
            onChange={(e) => handleHamiltonianChange(0, 0, e)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="H[0][1]"
            type="number"
            value={hamiltonian[0][1]}
            onChange={(e) => handleHamiltonianChange(0, 1, e)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="H[1][0]"
            type="number"
            value={hamiltonian[1][0]}
            onChange={(e) => handleHamiltonianChange(1, 0, e)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="H[1][1]"
            type="number"
            value={hamiltonian[1][1]}
            onChange={(e) => handleHamiltonianChange(1, 1, e)}
          />
        </Grid>
      </Grid>

      <Box>
        <Typography>State Vector:</Typography>
        <pre>{`[ ${state[0]}, ${state[1]} ]`}</pre>
      </Box>
    </Box>
  );
};

export default HamiltonianEvolution;
