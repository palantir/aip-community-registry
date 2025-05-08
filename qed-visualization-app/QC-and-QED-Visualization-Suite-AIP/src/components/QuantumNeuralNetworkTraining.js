// src/components/QuantumNeuralNetworkTraining.js

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
 * QuantumNeuralNetworkTraining Component
 *
 * This component simulates the training process of a Quantum Neural Network (QNN) agent.
 * It provides controls to adjust hyperparameters such as learning rate, total epochs,
 * number of layers, and nodes per layer. During training, a dummy loss value is computed
 * and visualized in a real-time line chart. Additionally, an SVG-based network diagram
 * visually represents the QNN architecture with the specified number of layers and nodes.
 */
const QuantumNeuralNetworkTraining = () => {
  // Training state variables
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(100);
  const [learningRate, setLearningRate] = useState(0.01);
  const [trainingLossData, setTrainingLossData] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(500); // in ms
  const trainingIntervalRef = useRef(null);

  // QNN architecture parameters
  const [numLayers, setNumLayers] = useState(3);
  const [nodesPerLayer, setNodesPerLayer] = useState(4);
  const [optimizer, setOptimizer] = useState('Adam');

  /**
   * resetTraining function
   *
   * Resets the training simulation state.
   */
  const resetTraining = () => {
    setIsTraining(false);
    setEpoch(0);
    setTrainingLossData([]);
  };

  /**
   * startTraining function
   *
   * Starts the training simulation.
   */
  const startTraining = () => {
    if (epoch >= totalEpochs) {
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
   * simulateTrainingStep function
   *
   * Simulates a single training step by computing a dummy loss value.
   * The loss decays exponentially with increasing epoch and is affected by noise.
   *
   * @returns {number} The loss value for the current step.
   */
  const simulateTrainingStep = useCallback(() => {
    // Base loss decays exponentially with epoch; higher layers make training more complex.
    const baseLoss = Math.exp(-epoch / totalEpochs * numLayers) * 100;
    const noise = (Math.random() * 10 - 5) * (1 - epoch / totalEpochs); // noise diminishes over time
    const loss = Math.max(0, baseLoss + noise);
    return loss;
  }, [epoch, totalEpochs, numLayers]);

  // Training simulation effect: increment epoch and update training loss.
  useEffect(() => {
    if (isTraining && epoch < totalEpochs) {
      trainingIntervalRef.current = setInterval(() => {
        setEpoch((prev) => {
          const nextEpoch = prev + 1;
          const loss = simulateTrainingStep();
          setTrainingLossData((prevData) => [
            ...prevData,
            { epoch: nextEpoch, loss },
          ]);
          if (nextEpoch >= totalEpochs) {
            setIsTraining(false);
          }
          return nextEpoch;
        });
      }, simulationSpeed);
    }
    return () => clearInterval(trainingIntervalRef.current);
  }, [isTraining, simulationSpeed, totalEpochs, simulateTrainingStep, epoch]);

  // -------------------------
  // Network Diagram Visualization
  // -------------------------
  /**
   * Render the QNN architecture as an SVG diagram.
   * Each layer is displayed as a horizontal row of nodes, and connections (lines)
   * are drawn between adjacent layers.
   */
  const renderNetworkDiagram = () => {
    // Dimensions for the diagram
    const width = 500;
    const height = 200;
    const layerSpacing = height / (numLayers + 1);
    const diagramNodes = [];

    // For each layer, compute the x, y positions for nodes
    for (let layer = 0; layer < numLayers; layer++) {
      const y = (layer + 1) * layerSpacing;
      const nodeSpacing = width / (nodesPerLayer + 1);
      const layerNodes = [];
      for (let node = 0; node < nodesPerLayer; node++) {
        const x = (node + 1) * nodeSpacing;
        layerNodes.push({ x, y });
      }
      diagramNodes.push(layerNodes);
    }

    // Create SVG elements for nodes and connecting lines
    return (
      <svg width={width} height={height} style={{ border: '1px solid #ccc', marginTop: '16px' }}>
        {/* Draw connections between layers */}
        {diagramNodes.map((layerNodes, i) => {
          if (i === diagramNodes.length - 1) return null; // skip last layer
          const nextLayerNodes = diagramNodes[i + 1];
          return layerNodes.map((node, index) =>
            nextLayerNodes.map((nextNode, j) => (
              <line
                key={`line-${i}-${index}-${i + 1}-${j}`}
                x1={node.x}
                y1={node.y}
                x2={nextNode.x}
                y2={nextNode.y}
                stroke="#888"
                strokeWidth={1}
              />
            ))
          );
        })}
        {/* Draw nodes */}
        {diagramNodes.flat().map((node, idx) => (
          <circle key={`node-${idx}`} cx={node.x} cy={node.y} r={10} fill="#0d47a1" />
        ))}
        {/* Label layers */}
        {diagramNodes.map((layerNodes, i) => (
          <text
            key={`layer-${i}`}
            x={10}
            y={(i + 1) * layerSpacing}
            fill="#333"
            fontSize="12"
          >
            Layer {i + 1}
          </text>
        ))}
      </svg>
    );
  };

  // -------------------------
  // Real-Time Statistics
  // -------------------------
  const averageLoss = useMemo(() => {
    if (trainingLossData.length === 0) return 0;
    const recentData = trainingLossData.slice(-20);
    const sum = recentData.reduce((acc, curr) => acc + curr.loss, 0);
    return (sum / recentData.length).toFixed(2);
  }, [trainingLossData]);

  // -------------------------
  // Render Component
  // -------------------------
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quantum Neural Network Training
      </Typography>
      <Typography variant="body1" gutterBottom>
        This module simulates training of a Quantum Neural Network (QNN) agent. Adjust the hyperparameters
        below, then click "Start Training" to begin. The network architecture is visualized below, and training loss is updated in real time.
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
          label="Total Epochs"
          type="number"
          value={totalEpochs}
          onChange={(e) => setTotalEpochs(parseInt(e.target.value, 10))}
          helperText="Total training epochs"
        />
        <TextField
          label="Number of Layers"
          type="number"
          value={numLayers}
          onChange={(e) => setNumLayers(parseInt(e.target.value, 10))}
          helperText="Set the number of layers in the QNN"
        />
        <TextField
          label="Nodes per Layer"
          type="number"
          value={nodesPerLayer}
          onChange={(e) => setNodesPerLayer(parseInt(e.target.value, 10))}
          helperText="Set the number of nodes in each layer"
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
          Reset
        </Button>
      </Box>

      {/* Training Progress Display */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Training Progress
        </Typography>
        <Typography variant="body2">
          Epoch: {epoch} / {totalEpochs}
        </Typography>
        {trainingLossData.length > 0 && (
          <Typography variant="body2">
            Average Loss (last 20 epochs): {averageLoss}
          </Typography>
        )}
      </Paper>

      {/* Network Architecture Diagram */}
      <Typography variant="h6" gutterBottom>
        QNN Architecture Diagram
      </Typography>
      {renderNetworkDiagram()}

      {/* Training Performance Chart */}
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Training Loss Over Epochs
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trainingLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="epoch"
              label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="loss" stroke="#0d47a1" name="Training Loss" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default QuantumNeuralNetworkTraining;
