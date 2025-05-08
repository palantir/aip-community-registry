// src/components/QuantumFourierTransform.js

import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { fft } from 'mathjs';

/**
 * QuantumFourierTransform Component
 *
 * This component simulates and visualizes the Quantum Fourier Transform (QFT)
 * on a simple 3-qubit system. It uses a Fast Fourier Transform (FFT) from the mathjs
 * library to compute the transformed amplitudes of the input quantum state.
 *
 * The visualization is rendered as a bar chart using Recharts, displaying the amplitude
 * for each quantum state.
 */
const QuantumFourierTransform = () => {
  // State variable to hold the transformed data for visualization.
  const [data, setData] = useState([]);

  useEffect(() => {
    // -------------------------------------
    // QFT Simulation Setup:
    // -------------------------------------
    // Define the input state amplitudes for a 3-qubit system.
    // Here, the input state is |000⟩ represented by [1, 0, 0, 0, 0, 0, 0, 0].
    const inputAmplitudes = [1, 0, 0, 0, 0, 0, 0, 0];

    // Apply the Fast Fourier Transform (FFT) to the input amplitudes.
    // The FFT returns complex numbers; we take the absolute value (magnitude)
    // of each complex number to obtain the amplitude.
    const transformedAmplitudes = fft(inputAmplitudes).map((c) => c.abs());

    // -------------------------------------
    // Prepare Data for Visualization:
    // -------------------------------------
    // Map each amplitude to its corresponding quantum state.
    // Each state is represented as a binary string with 3 digits.
    const states = inputAmplitudes.map((_, index) => {
      // Convert the index to a 3-digit binary string (e.g., 0 -> "000")
      const binaryState = index.toString(2).padStart(3, '0');
      return {
        state: binaryState,               // The quantum state label.
        amplitude: transformedAmplitudes[index], // The amplitude from the FFT.
      };
    });

    // Update the component state with the prepared data.
    setData(states);
  }, []); // Empty dependency array ensures this effect runs only once on component mount.

  return (
    <Box>
      {/* Title for the visualization */}
      <Typography variant="h6">Quantum Fourier Transform (QFT)</Typography>
      {/* Description providing context about QFT and its relevance */}
      <Typography paragraph>
        This visualization demonstrates the Quantum Fourier Transform on a 3-qubit system. The QFT is a key component in many quantum algorithms, including Shor's algorithm for factoring large numbers.
      </Typography>
      {/* Responsive container to ensure the bar chart fits the available width */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          {/* Add a grid with dashed lines for better readability */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-axis displays the quantum state labels */}
          <XAxis 
            dataKey="state" 
            label={{ value: 'Quantum State', position: 'insideBottom', offset: -5 }} 
          />
          {/* Y-axis displays the amplitude values */}
          <YAxis 
            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} 
          />
          {/* Tooltip shows details on hover */}
          <Tooltip />
          {/* Render bars representing the amplitude of each quantum state */}
          <Bar dataKey="amplitude" fill="#0d47a1" name="Amplitude" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuantumFourierTransform;
