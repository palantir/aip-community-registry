// src/components/ShorsAlgorithm.js

import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Paper } from '@mui/material';
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
 * ShorsAlgorithm Component
 *
 * This component simulates a simplified version of Shor's Algorithm for
 * integer factorization using period finding. The algorithm is demonstrated
 * by:
 *   - Accepting a number to factor (N) from the user.
 *   - Allowing the user to choose a co-prime value (a) for the simulation.
 *   - Finding the smallest period (r) such that a^r mod N equals 1.
 *   - Computing the potential factors based on the found period.
 *   - Preparing and displaying data for visualization, which shows the
 *     amplitude (using a cosine function) for each measurement outcome.
 *
 * The visualization is rendered as a bar chart using Recharts.
 */
const ShorsAlgorithm = () => {
  // State to hold the number to factor (N). Defaults to 15.
  const [numberToFactor, setNumberToFactor] = useState(15);
  // State for the co-prime value (a) to be used in the algorithm. Defaults to 2.
  const [coPrime, setCoPrime] = useState(2);
  // State to hold the data for the bar chart visualization.
  const [data, setData] = useState([]);
  // State to hold the computed result (period and factors).
  const [result, setResult] = useState(null);

  /**
   * handleNumberChange function
   *
   * Updates the number to factor when the user changes the input.
   * @param {object} event - The change event from the TextField.
   */
  const handleNumberChange = (event) => {
    setNumberToFactor(parseInt(event.target.value, 10));
  };

  /**
   * handleCoPrimeChange function
   *
   * Updates the co-prime value (a) when the user changes the input.
   * @param {object} event - The change event from the TextField.
   */
  const handleCoPrimeChange = (event) => {
    setCoPrime(parseInt(event.target.value, 10));
  };

  /**
   * gcd function
   *
   * Recursively computes the greatest common divisor of two numbers.
   * @param {number} a - First number.
   * @param {number} b - Second number.
   * @returns {number} The greatest common divisor of a and b.
   */
  const gcd = (a, b) => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  /**
   * runShorsAlgorithm function
   *
   * Simulates the period finding part of Shor's Algorithm for the provided number (N)
   * and co-prime value (a). It searches for the smallest period r such that:
   *    a^r mod N === 1,
   * then computes two potential factors using the greatest common divisor (gcd)
   * between N and (a^(r/2) ± 1). Additionally, it prepares an array of amplitudes for
   * visualization purposes.
   */
  const runShorsAlgorithm = () => {
    const N = numberToFactor;
    const a = coPrime;

    // Validate inputs: N must be at least 2, and a must be positive and less than N.
    if (N < 2 || a < 1 || a >= N) {
      alert("Please enter a valid number to factor (N ≥ 2) and a co-prime value (1 ≤ a < N).");
      return;
    }

    const periods = [];

    // Find the period: iterate r from 1 to N-1 and check if a^r mod N equals 1.
    for (let r = 1; r < N; r++) {
      if (Math.pow(a, r) % N === 1) {
        periods.push(r);
      }
    }

    // Choose the first period found; if none found, default to N - 1.
    const period = periods[0] || N - 1;
    // Compute factors using the greatest common divisor (gcd)
    const factor1 = gcd(Math.pow(a, period / 2) - 1, N);
    const factor2 = gcd(Math.pow(a, period / 2) + 1, N);

    // Set the computed result: period and factors.
    setResult({
      period,
      factors: [factor1, factor2],
    });

    // Prepare data for visualization.
    // For each possible measurement outcome k (from 0 to N-1), compute an amplitude.
    // The amplitude is computed using a cosine function that depends on the period.
    const amplitudes = Array.from({ length: N }, (_, k) => ({
      k,
      amplitude: Math.abs(Math.cos((2 * Math.PI * k * period) / N)),
    }));

    setData(amplitudes);
  };

  /**
   * resetAlgorithm function
   *
   * Resets the simulation by clearing the current result and data.
   */
  const resetAlgorithm = () => {
    setResult(null);
    setData([]);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Component Title */}
      <Typography variant="h6" gutterBottom>
        Shor's Algorithm
      </Typography>
      {/* Brief Description */}
      <Typography paragraph>
        This visualization demonstrates Shor's algorithm for integer factorization using period finding.
        Enter a number to factor (N) and a co-prime value (a) to begin the simulation.
      </Typography>
      {/* Input Section */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Number to Factor (N)"
          type="number"
          value={numberToFactor}
          onChange={handleNumberChange}
          helperText="N must be at least 2"
        />
        <TextField
          label="Co-Prime Value (a)"
          type="number"
          value={coPrime}
          onChange={handleCoPrimeChange}
          helperText="a should be in the range [1, N)"
        />
        <Button variant="contained" onClick={runShorsAlgorithm}>
          Run Algorithm
        </Button>
        <Button variant="outlined" onClick={resetAlgorithm}>
          Reset
        </Button>
      </Box>
      {/* Display Computed Result */}
      {result && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1">
            <strong>Period found:</strong> {result.period}
          </Typography>
          <Typography variant="body1">
            <strong>Factors:</strong> {result.factors[0]} and {result.factors[1]}
          </Typography>
        </Paper>
      )}
      {/* Bar Chart Visualization */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="k"
            label={{ value: 'Measurement Outcome', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="amplitude" fill="#0d47a1" name="Amplitude" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ShorsAlgorithm;
