// src/components/QuantumAiAgentModel.js

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
  Card,
  CardContent,
  CardHeader,
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
 * QuantumAiAgentModel Component
 *
 * This component simulates the training of a Quantum AI Agent Model.
 * Users can adjust hyperparameters such as learning rate, total epochs, number of layers,
 * nodes per layer, optimizer type, and simulation speed.
 *
 * The training simulation generates a dummy loss value that decays over time with some noise.
 * It visualizes the training loss in a line chart and displays real-time metrics such as current
 * epoch, simulated accuracy, and model confidence. Additionally, an SVG-based diagram shows the
 * current Quantum Neural Network (QNN) architecture based on the number of layers and nodes per layer.
 */
const QuantumAiAgentModel = () => {
  // -------------------------
  // Training Simulation State
  // -------------------------
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const totalEpochs = 100;
  const [learningRate, setLearningRate] = useState(0.01);
  const [trainingLossData, setTrainingLossData] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(500); // in ms
  const trainingIntervalRef = useRef(null);

  // -------------------------
  // QNN Architecture State
  // -------------------------
  const [numLayers, setNumLayers] = useState(3);
  const [nodesPerLayer, setNodesPerLayer] = useState(4);
  const [optimizer, setOptimizer] = useState('Adam');

  // -------------------------
  // Derived Metrics (simulated)
  // -------------------------
  const [accuracy, setAccuracy] = useState(0);
  const [confidence, setConfidence] = useState(0);

  // -------------------------
  // Training Simulation Functions
  // -------------------------

  /**
   * resetTraining function
   *
   * Resets the training simulation state.
   */
  const resetTraining = () => {
    setIsTraining(false);
    setEpoch(0);
    setTrainingLossData([]);
    setAccuracy(0);
    setConfidence(0);
  };

  /**
   * startTraining function
   *
   * Starts the training simulation. Resets if training has already completed.
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
   * Simulates one training step by computing a dummy loss value.
   * The loss decays exponentially with the epoch and is perturbed by noise.
   * Additionally, simulated accuracy increases and confidence rises over time.
   *
   * @returns {number} The computed loss for the current epoch.
   */
  const simulateTrainingStep = useCallback(() => {
    // Base loss decays with epoch, modulated by the number of layers.
    const baseLoss = Math.exp(-epoch / totalEpochs * numLayers) * 100;
    // Noise diminishes over time.
    const noise = (Math.random() * 10 - 5) * (1 - epoch / totalEpochs);
    return Math.max(0, baseLoss + noise);
  }, [epoch, totalEpochs, numLayers]);

  // -------------------------
  // Training Simulation Effect
  // -------------------------
  useEffect(() => {
    if (isTraining && epoch < totalEpochs) {
      trainingIntervalRef.current = setInterval(() => {
        setEpoch((prevEpoch) => {
          const nextEpoch = prevEpoch + 1;
          const loss = simulateTrainingStep();
          setTrainingLossData((prevData) => [
            ...prevData,
            { epoch: nextEpoch, loss },
          ]);

          // Simulate increasing accuracy and confidence.
          setAccuracy(Math.min(100, (nextEpoch / totalEpochs) * 100 + Math.random() * 5));
          setConfidence(Math.min(100, (nextEpoch / totalEpochs) * 100 + Math.random() * 3));

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
  // Real-Time Metrics (Averages)
  // -------------------------
  const averageLoss = useMemo(() => {
    if (trainingLossData.length === 0) return 0;
    const recentData = trainingLossData.slice(-20);
    const sum = recentData.reduce((acc, curr) => acc + curr.loss, 0);
    return (sum / recentData.length).toFixed(2);
  }, [trainingLossData]);

  // -------------------------
  // QNN Architecture Diagram (SVG)
  // -------------------------
  /**
   * renderNetworkDiagram function:
   * Renders an SVG diagram of the QNN architecture based on the current number of layers and nodes per layer.
   * Nodes are arranged in horizontal rows, and lines connect every node in a layer to every node in the next layer.
   */
  const renderNetworkDiagram = useMemo(() => {
    const width = 500;
    const height = 200;
    const layerSpacing = height / (numLayers + 1);
    const diagramNodes = [];

    // Compute node positions for each layer.
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

    return (
      <svg width={width} height={height} style={{ border: '1px solid #ccc', marginTop: '16px' }}>
        {/* Draw connections between layers */}
        {diagramNodes.map((layerNodes, i) => {
          if (i === diagramNodes.length - 1) return null;
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
        {/* Label each layer */}
        {diagramNodes.map((_, i) => (
          <text key={`layer-${i}`} x={10} y={(i + 1) * layerSpacing} fill="#333" fontSize="12">
            Layer {i + 1}
          </text>
        ))}
      </svg>
    );
  }, [numLayers, nodesPerLayer]);

  // -------------------------
  // Render Component
  // -------------------------
  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto', mt: 2 }}>
      <CardHeader title="Quantum AI Agent Training" />
      <CardContent>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Quantum AI Agent Training
          </Typography>
          <Typography variant="body1" gutterBottom>
            Adjust the hyperparameters below to train your Quantum Neural Network (QNN) agent.
            As training progresses, the training loss will be updated in real time,
            and the network architecture will be visualized below.
          </Typography>
        </Box>

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
            onChange={(e) => totalEpochs(parseInt(e.target.value, 10))}
            helperText="Total training epochs"
          />
          <TextField
            label="Number of Layers"
            type="number"
            value={numLayers}
            onChange={(e) => setNumLayers(parseInt(e.target.value, 10))}
            helperText="Number of layers in the QNN"
          />
          <TextField
            label="Nodes per Layer"
            type="number"
            value={nodesPerLayer}
            onChange={(e) => setNodesPerLayer(parseInt(e.target.value, 10))}
            helperText="Number of nodes per layer"
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

        {/* Metrics Panel */}
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Training Metrics
          </Typography>
          <Typography variant="body2">Epoch: {epoch} / {totalEpochs}</Typography>
          {trainingLossData.length > 0 && (
            <Typography variant="body2">
              Average Loss (last 20 epochs): {averageLoss}
            </Typography>
          )}
          <Typography variant="body2">Learning Rate: {learningRate}</Typography>
          <Typography variant="body2">Accuracy: {accuracy.toFixed(1)}%</Typography>
          <Typography variant="body2">Confidence: {confidence.toFixed(1)}%</Typography>
        </Paper>

        {/* QNN Architecture Diagram */}
        <Typography variant="h6" gutterBottom>
          QNN Architecture Diagram
        </Typography>
        {renderNetworkDiagram()}

        {/* Training Loss Chart */}
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
              <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#0d47a1"
                name="Training Loss"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default QuantumAiAgentModel;
