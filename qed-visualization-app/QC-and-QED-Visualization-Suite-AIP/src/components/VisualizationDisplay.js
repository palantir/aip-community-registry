// src/components/VisualizationDisplay.js

import React, { Suspense } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar,
} from 'recharts';
import { Box, Typography } from '@mui/material';

// Lazy load heavy visualization components.
const BlochSphere3D = React.lazy(() => import('./BlochSphere3D'));
const QuantumCircuitBuilder = React.lazy(() => import('./QuantumCircuitBuilder'));
const GroverAlgorithm = React.lazy(() => import('./GroverAlgorithm'));
const QuantumTeleportation = React.lazy(() => import('./QuantumTeleportation'));
const QuantumGateSimulator = React.lazy(() => import('./QuantumGateSimulator'));
const QuantumFourierTransform = React.lazy(() => import('./QuantumFourierTransform'));
const ShorsAlgorithm = React.lazy(() => import('./ShorsAlgorithm'));
const QuantumErrorCorrection = React.lazy(() => import('./QuantumErrorCorrection'));
const QuantumWalkSimulation = React.lazy(() => import('./QuantumWalkSimulation'));
const DensityMatrixVisualization = React.lazy(() => import('./DensityMatrixVisualization'));
const HamiltonianEvolution = React.lazy(() => import('./HamiltonianEvolution'));
const QuantumAiTraining = React.lazy(() => import('./QuantumAiTraining'));
const QuantumNeuralNetworkTraining = React.lazy(() =>
  import('./QuantumNeuralNetworkTraining')
);

/**
 * VisualizationDisplay Component
 *
 * This component selects and renders a specific visualization based on the
 * value of the 'selectedVisualization' prop. It supports various visualization
 * types, such as:
 * - QED Interaction (line chart)
 * - Bloch Sphere (3D visualization)
 * - Quantum Circuit (scatter chart)
 * - Entanglement (line chart)
 * - Custom Quantum Circuit (circuit builder)
 * - Grover's Algorithm
 * - Shor's Algorithm
 * - Quantum Error Correction
 * - Quantum Walk
 * - Density Matrix
 * - Quantum Teleportation
 * - Quantum Gate Simulator
 * - Quantum Fourier Transform
 * - Hamiltonian Evolution
 * - Quantum AI Training
 * - Quantum Neural Network Training
 * - Bar Chart (for demonstration using recharts' BarChart and Bar)
 *
 * Lazy loading is used for heavy components to optimize performance.
 *
 * @param {Object} props - Component props.
 * @param {string} props.selectedVisualization - Selected visualization key.
 * @param {Array} props.data - Data for visualizations (e.g., QED interaction, bar chart).
 * @param {Array} props.blochSphereData - Data for the Bloch sphere visualization.
 * @param {Array} props.quantumCircuitData - Data for the quantum circuit visualization.
 * @param {Array} props.entanglementData - Data for the entanglement visualization.
 * @param {string} props.customCircuit - Custom circuit string for the circuit builder.
 */
const VisualizationDisplay = ({
  selectedVisualization,
  data,
  blochSphereData,
  quantumCircuitData,
  entanglementData,
  customCircuit,
}) => {
  /**
   * renderVisualization function:
   * Renders the appropriate visualization based on the selectedVisualization prop.
   */
  const renderVisualization = () => {
    switch (selectedVisualization) {
      case 'qed':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="electronPosition"
                stroke="#0d47a1"
                name="Electron Position"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="photonEmission"
                stroke="#ff6f00"
                name="Photon Emission"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="interaction"
                stroke="#ff9800"
                name="Interaction"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bloch':
        return (
          <Box sx={{ height: '400px' }}>
            <BlochSphere3D blochSphereData={blochSphereData} />
          </Box>
        );
      case 'circuit':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="step" name="Gate Step" />
              <YAxis type="number" dataKey="z" name="Z" />
              <ZAxis type="number" range={[0, 1]} name="Y" dataKey="y" />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Qubit State" data={quantumCircuitData} fill="#ff6f00" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'entanglement':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={entanglementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="qubitA.x"
                stroke="#0d47a1"
                name="Qubit A X"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="qubitB.x"
                stroke="#ff6f00"
                name="Qubit B X"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="qubitA.y"
                stroke="#ff9800"
                name="Qubit A Y"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="qubitB.y"
                stroke="#4caf50"
                name="Qubit B Y"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'customCircuit':
        return (
          <QuantumCircuitBuilder
            customCircuit={customCircuit}
            onCircuitChange={(nodes, edges) => console.log(nodes, edges)}
          />
        );
      case 'grover':
        return <GroverAlgorithm />;
      case 'shor':
        return <ShorsAlgorithm />;
      case 'errorCorrection':
        return <QuantumErrorCorrection />;
      case 'quantumWalk':
        return <QuantumWalkSimulation />;
      case 'densityMatrix':
        return <DensityMatrixVisualization />;
      case 'teleportation':
        return <QuantumTeleportation />;
      case 'gateSimulator':
        return <QuantumGateSimulator />;
      case 'qft':
        return <QuantumFourierTransform />;
      case 'hamiltonianEvolution':
        return <HamiltonianEvolution />;
      case 'quantumAiTraining':
        return (
          <Suspense
            fallback={
              <Box sx={{ p: 2 }}>
                <Typography variant="body1">Loading Quantum AI Training...</Typography>
              </Box>
            }
          >
            <QuantumAiTraining />
          </Suspense>
        );
      case 'quantumNeuralNetworkTraining':
        return (
          <Suspense
            fallback={
              <Box sx={{ p: 2 }}>
                <Typography variant="body1">Loading Quantum Neural Network Training...</Typography>
              </Box>
            }
          >
            <QuantumNeuralNetworkTraining />
          </Suspense>
        );
      // New case: Bar Chart demonstration
      case 'barChart':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: 'X Axis', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Bar Data" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">
              No visualization selected. Please choose a valid visualization type.
            </Typography>
          </Box>
        );
    }
  };

  return (
    // Wrap the visualization in Suspense for lazy-loading.
    <Suspense
      fallback={
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">Loading visualization...</Typography>
        </Box>
      }
    >
      {renderVisualization()}
    </Suspense>
  );
};

export default VisualizationDisplay;
