// src/components/QuantumAiTraining.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

/**
 * QuantumAiTraining Component
 *
 * This component simulates the training process of a Quantum AI Agent.
 * Users can adjust hyperparameters such as learning rate and the total number of episodes,
 * start/pause/reset the training, and view real-time progress of the training via a line chart.
 *
 * The training simulation here is a mock-up: it simply increments the episode count
 * and computes a dummy "reward" that trends upward over time with some noise.
 */
const QuantumAiTraining = () => {
  // Training state variables
  const [isTraining, setIsTraining] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(100);
  const [learningRate, setLearningRate] = useState(0.01);
  const [trainingData, setTrainingData] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(500); // update interval in ms
  const trainingIntervalRef = useRef(null);

  // Hyperparameter for choosing an "optimizer" (dummy selection)
  const [optimizer, setOptimizer] = useState('SGD');

  /**
   * startTraining function
   *
   * Starts the training simulation by enabling the training flag.
   */
  const startTraining = () => {
    if (episode >= totalEpisodes) {
      // If training already completed, reset before starting
      resetTraining();
    }
    setIsTraining(true);
  };

  /**
   * pauseTraining function
   *
   * Pauses the training simulation.
   */
  const pauseTraining = () => {
    setIsTraining(false);
  };

  /**
   * resetTraining function
   *
   * Resets the training simulation state to the initial values.
   */
  const resetTraining = () => {
    setIsTraining(false);
    setEpisode(0);
    setTrainingData([]);
  };

  /**
   * simulateTrainingStep function
   *
   * Simulates one training step. Computes a dummy reward value that
   * increases over time with some added noise.
   *
   * Wrapped in useCallback to ensure a stable reference.
   *
   * @returns {number} reward value for the current step.
   */
  const simulateTrainingStep = useCallback(() => {
    // Example reward function: a slowly increasing value with noise.
    // Using episode + 1 ensures that even at episode 0, we get a non-zero value.
    const baseReward = Math.log(episode + 2) * 10;
    const noise = Math.random() * 5 - 2.5; // noise between -2.5 and 2.5
    const reward = Math.max(0, baseReward + noise);
    return reward;
  }, [episode]);

  // Use a ref to hold the latest simulateTrainingStep function.
  const simulateTrainingStepRef = useRef(simulateTrainingStep);
  useEffect(() => {
    simulateTrainingStepRef.current = simulateTrainingStep;
  }, [simulateTrainingStep]);

  // Effect to run the training simulation when isTraining is true.
  useEffect(() => {
    if (isTraining && episode < totalEpisodes) {
      trainingIntervalRef.current = setInterval(() => {
        setEpisode((prevEpisode) => {
          const nextEpisode = prevEpisode + 1;
          const reward = simulateTrainingStepRef.current();
          setTrainingData((prevData) => [
            ...prevData,
            { episode: nextEpisode, reward },
          ]);
          if (nextEpisode >= totalEpisodes) {
            setIsTraining(false);
          }
          return nextEpisode;
        });
      }, simulationSpeed);
    }
    return () => clearInterval(trainingIntervalRef.current);
  }, [episode, isTraining, simulationSpeed, totalEpisodes]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quantum AI Agent Training
      </Typography>
      <Typography variant="body1" gutterBottom>
        This module simulates the training of a Quantum AI Agent. Adjust the hyperparameters below, then click "Start Training" to begin.
      </Typography>

      {/* Hyperparameter Controls */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <TextField
          label="Learning Rate"
          type="number"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          inputProps={{ step: 0.001, min: 0, max: 1 }}
          helperText="Set the learning rate"
        />
        <TextField
          label="Total Episodes"
          type="number"
          value={totalEpisodes}
          onChange={(e) => setTotalEpisodes(parseInt(e.target.value, 10))}
          helperText="Total training episodes"
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="optimizer-select-label">Optimizer</InputLabel>
          <Select
            labelId="optimizer-select-label"
            value={optimizer}
            label="Optimizer"
            onChange={(e) => setOptimizer(e.target.value)}
          >
            <MenuItem value="SGD">SGD</MenuItem>
            <MenuItem value="Adam">Adam</MenuItem>
            <MenuItem value="RMSProp">RMSProp</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ width: 300 }}>
          <Typography gutterBottom>
            Simulation Speed (ms): {simulationSpeed}
          </Typography>
          <Slider
            value={simulationSpeed}
            onChange={(e, value) => setSimulationSpeed(value)}
            min={50}
            max={1000}
            step={50}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      {/* Training Control Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={startTraining} disabled={isTraining}>
          Start Training
        </Button>
        <Button variant="contained" onClick={pauseTraining} disabled={!isTraining}>
          Pause Training
        </Button>
        <Button variant="outlined" onClick={resetTraining}>
          Reset Training
        </Button>
      </Box>

      {/* Training Progress Display */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Training Progress
        </Typography>
        <Typography variant="body2">
          Episode: {episode} / {totalEpisodes}
        </Typography>
      </Paper>

      {/* Training Performance Chart */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Reward Over Episodes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trainingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="episode"
              label={{ value: 'Episode', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Reward', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reward" stroke="#0d47a1" name="Reward" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default QuantumAiTraining;
