// src/components/QuantumWalkSimulation.js

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Button, TextField } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * QuantumWalkSimulation Component
 *
 * This component simulates a quantum walk by calculating probability
 * distributions for a given number of steps. Users can update the number of steps,
 * and the simulation will update accordingly. The simulation results are displayed
 * in a line chart.
 */
const QuantumWalkSimulation = () => {
  // State to hold simulation data for each position.
  const [data, setData] = useState([]);
  // State to hold the number of steps for the simulation.
  const [steps, setSteps] = useState(20);

  /**
   * simulateQuantumWalk function
   *
   * Computes the probability for each position based on the current number of steps.
   * It generates an array of positions and calculates the probability for each
   * using a cosine function.
   */
  const simulateQuantumWalk = useCallback(() => {
    // Create an array of positions from -steps to +steps.
    const positions = Array.from({ length: 2 * steps + 1 }, (_, i) => i - steps);
    // Compute the probability for each position.
    const probabilities = positions.map((pos) => ({
      position: pos,
      probability: (1 / (2 * steps)) * (1 + Math.cos((Math.PI * pos) / steps)),
    }));
    setData(probabilities);
  }, [steps]);

  // Run the simulation whenever the 'simulateQuantumWalk' function (i.e. 'steps') changes.
  useEffect(() => {
    simulateQuantumWalk();
  }, [simulateQuantumWalk]);

  /**
   * handleStepsChange function
   *
   * Updates the 'steps' state based on user input.
   * @param {object} event - The change event from the TextField.
   */
  const handleStepsChange = (event) => {
    const newSteps = parseInt(event.target.value, 10);
    if (!isNaN(newSteps)) {
      setSteps(newSteps);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Quantum Walk Simulation</Typography>
      <Typography paragraph>
        This visualization demonstrates a quantum walk compared to a classical random walk.
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        {/* Numeric input for the number of steps */}
        <TextField
          label="Steps"
          type="number"
          value={steps}
          onChange={handleStepsChange}
          sx={{ mr: 2, width: '100px' }}
        />
        <Button variant="contained" onClick={simulateQuantumWalk}>
          Simulate Quantum Walk
        </Button>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="position"
            label={{ value: 'Position', position: 'insideBottom' }}
          />
          <YAxis
            label={{ value: 'Probability', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="probability"
            stroke="#0d47a1"
            name="Quantum Walk"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuantumWalkSimulation;
