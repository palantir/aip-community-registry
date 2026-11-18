// src/components/GroverAlgorithm.js

import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
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
 * GroverAlgorithm Component
 *
 * This component simulates the probability amplitudes for Grover's search algorithm.
 * Grover's algorithm is designed to search an unsorted database with quadratic speedup.
 * In this simulation, the probability of finding the marked item increases with each iteration.
 * The iteration corresponding to the marked item is highlighted in the chart.
 */
const GroverAlgorithm = () => {
  // State to hold the simulation data for each iteration.
  const [data, setData] = useState([]);

  useEffect(() => {
    // --------------------------------------------
    // Simulation Setup:
    // --------------------------------------------
    // 'N' represents the size of the database.
    const N = 8;
    // 'markedItem' is the target item we are searching for.
    // In this example, we use it to highlight a specific iteration.
    const markedItem = 3;
    // Calculate the number of iterations for Grover's algorithm.
    // Formula: iterations = floor((π/4) * sqrt(N))
    const iterations = Math.floor((Math.PI / 4) * Math.sqrt(N));

    // Initialize an empty array to store the probability values for each iteration.
    const steps = [];
    let probability = 0;

    // Loop through each iteration to compute the probability of success.
    for (let i = 0; i <= iterations; i++) {
      // Calculate the probability amplitude using Grover's algorithm formula:
      // probability = sin^2((2*i + 1) * arcsin(1/√N))
      probability = Math.sin(((2 * i + 1) * Math.asin(1 / Math.sqrt(N)))) ** 2;
      // Determine if the current iteration is the marked item iteration.
      const isMarked = i === markedItem;
      // Store the iteration and its corresponding probability, along with the marker flag.
      steps.push({ iteration: i, probability, isMarked });
    }

    // Update the state with the simulation data.
    setData(steps);
  }, []);

  /**
   * Custom dot renderer to highlight the marked iteration.
   * If the payload (data point) has the `isMarked` property, a larger red dot is rendered.
   */
  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.isMarked) {
      return <circle cx={cx} cy={cy} r={8} fill="red" stroke="none" />;
    }
    return <circle cx={cx} cy={cy} r={4} fill="#0d47a1" stroke="none" />;
  };

  return (
    <Box>
      {/* Title */}
      <Typography variant="h6">Grover's Algorithm</Typography>
      {/* Description */}
      <Typography paragraph>
        This visualization demonstrates Grover's search algorithm, showing how the probability
        of finding the desired item increases with each iteration. The iteration corresponding
        to the marked item is highlighted in red.
      </Typography>
      {/* Responsive container to make the chart adapt to the available width */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Add a grid with dashed lines for better readability */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-axis displaying the iteration number */}
          <XAxis
            dataKey="iteration"
            label={{ value: 'Iteration', position: 'insideBottomRight', offset: -10 }}
          />
          {/* Y-axis displaying the probability values */}
          <YAxis
            label={{ value: 'Probability', angle: -90, position: 'insideLeft' }}
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
          />
          {/* Tooltip to display detailed information on hover */}
          <Tooltip />
          {/* Legend to indicate the meaning of the chart line */}
          <Legend />
          {/* Line representing the probability as a function of the iteration */}
          <Line
            type="monotone"
            dataKey="probability"
            stroke="#0d47a1"
            name="Probability"
            dot={renderCustomDot}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GroverAlgorithm;
