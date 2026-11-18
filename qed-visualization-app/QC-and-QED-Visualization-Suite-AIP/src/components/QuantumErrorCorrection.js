// src/components/QuantumErrorCorrection.js

import React, { useState } from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * QuantumErrorCorrection Component
 *
 * This component demonstrates a simple implementation of quantum error correction
 * using the three-qubit bit-flip code. In this simplified example, a logical qubit is
 * encoded into three physical qubits. An error is simulated by flipping one of the qubits,
 * and then a correction is applied using a majority vote to restore the original state.
 *
 * The component displays the states of the three qubits in a bar chart and as a text summary.
 */
const QuantumErrorCorrection = () => {
  // State to hold the data representing each qubit's state.
  // Each item in the data array represents a qubit with a label and its state (0 or 1).
  const [data, setData] = useState([]);

  // State to track whether an error has been introduced.
  const [errorIntroduced, setErrorIntroduced] = useState(false);

  /**
   * encodeQubit function
   *
   * Encodes a logical qubit into three physical qubits.
   * In this simplified example, the logical qubit state is represented by 1,
   * and it is copied to all three physical qubits.
   * Resets any previously introduced error.
   */
  const encodeQubit = () => {
    // Represent the encoded qubits; here, all qubits start in state 1.
    const qubits = [1, 1, 1];
    // Update the data state with each qubit's label and state.
    setData([
      { qubit: 'Q1', state: qubits[0] },
      { qubit: 'Q2', state: qubits[1] },
      { qubit: 'Q3', state: qubits[2] },
    ]);
    // Reset the error flag.
    setErrorIntroduced(false);
  };

  /**
   * introduceError function
   *
   * Simulates an error by flipping the state of the first qubit.
   * The bit-flip is performed using the XOR operator (^).
   * Sets the errorIntroduced flag to true.
   */
  const introduceError = () => {
    // Update the data by flipping the state of the first qubit only.
    setData((prevData) =>
      prevData.map((q, index) =>
        index === 0 ? { ...q, state: q.state ^ 1 } : q
      )
    );
    // Mark that an error has been introduced.
    setErrorIntroduced(true);
  };

  /**
   * correctError function
   *
   * Corrects the error using a majority vote approach.
   * It sums the states of all three qubits; if at least two qubits are in state 1,
   * the corrected state is set to 1, otherwise it is set to 0.
   * Updates all qubits with the corrected state.
   */
  const correctError = () => {
    // Extract the current states of the qubits.
    const qubits = data.map((q) => q.state);
    // Apply majority vote: if sum of states is at least 2, then state is 1, otherwise 0.
    const correctedState = qubits.reduce((a, b) => a + b) >= 2 ? 1 : 0;
    // Update all qubits with the corrected state.
    setData([
      { qubit: 'Q1', state: correctedState },
      { qubit: 'Q2', state: correctedState },
      { qubit: 'Q3', state: correctedState },
    ]);
  };

  /**
   * resetSimulation function
   *
   * Resets the simulation by clearing the current state and error flags.
   */
  const resetSimulation = () => {
    setData([]);
    setErrorIntroduced(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Title and Description */}
      <Typography variant="h6" gutterBottom>
        Quantum Error Correction
      </Typography>
      <Typography paragraph>
        This visualization demonstrates the three-qubit bit-flip code. You can encode a qubit,
        introduce an error, and then correct the error using a majority vote mechanism.
      </Typography>

      {/* Control Buttons */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" onClick={encodeQubit}>
          Encode Qubit
        </Button>
        <Button
          variant="contained"
          onClick={introduceError}
          disabled={errorIntroduced || data.length === 0}
        >
          Introduce Error
        </Button>
        <Button
          variant="contained"
          onClick={correctError}
          disabled={!errorIntroduced}
        >
          Correct Error
        </Button>
        <Button variant="outlined" onClick={resetSimulation}>
          Reset Simulation
        </Button>
      </Box>

      {/* Current Qubit State Display */}
      {data.length > 0 && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Qubit States:
          </Typography>
          {data.map((q) => (
            <Typography key={q.qubit} variant="body2">
              {q.qubit}: {q.state}
            </Typography>
          ))}
        </Paper>
      )}

      {/* Bar Chart Visualization */}
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="qubit" />
            <YAxis
              label={{ value: 'State', angle: -90, position: 'insideLeft' }}
              domain={[0, 1]}
              ticks={[0, 1]}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="state" fill="#0d47a1" name="Qubit State" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default QuantumErrorCorrection;
