// src/components/QEDVisualization.js

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Popover,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import VisualizationControls from './VisualizationControls';
import VisualizationDisplay from './VisualizationDisplay';
import ExplanationSection from './ExplanationSection';
import QuantumAiTraining from './QuantumAiTraining'; // Existing training module
import QuantumAiAgentModel from './QuantumAiAgentModel'; // New Quantum AI Model component

/**
 * QEDVisualization Component
 *
 * This component visualizes advanced quantum computing and QED (Quantum Electrodynamics)
 * phenomena. It calculates data sets for QED interactions, Bloch sphere coordinates,
 * quantum circuit evolution, and entanglement between qubits.
 *
 * Additionally, two training modules for Quantum AI are available:
 * - Quantum AI Training
 * - Quantum AI Model
 *
 * Users can control simulation parameters via the UI, pause/resume the simulation,
 * adjust simulation speed, input custom quantum circuits, or switch to one of the training modules.
 * A Debug Info panel displays all simulation parameters.
 */
const QEDVisualization = () => {
  // -------------------------
  // State Variables
  // -------------------------
  const [data, setData] = useState([]); // QED interaction data over time
  const [blochSphereData, setBlochSphereData] = useState([]); // Bloch sphere coordinates
  const [quantumCircuitData, setQuantumCircuitData] = useState([]); // Quantum circuit evolution data
  const [entanglementData, setEntanglementData] = useState([]); // Entanglement data between qubits
  const [time, setTime] = useState(0); // Simulation time
  const [isRunning, setIsRunning] = useState(true); // Simulation running flag

  // Simulation parameters
  const [electronFrequency, setElectronFrequency] = useState(1);
  const [photonFrequency, setPhotonFrequency] = useState(2);
  const [decayRate, setDecayRate] = useState(0.1);
  const [interactionStrength, setInteractionStrength] = useState(0.5);
  const [quantumNoiseLevel, setQuantumNoiseLevel] = useState(0.1);

  // Visualization and circuit parameters (including training modes)
  // Note: The visualization selector now includes "quantumAiTraining" and "quantumAiModel".
  const [selectedVisualization, setSelectedVisualization] = useState('qed');
  const [qubitCount, setQubitCount] = useState(2);
  const [gateType, setGateType] = useState('hadamard');
  const [customCircuit, setCustomCircuit] = useState('');

  // Simulation speed in milliseconds.
  const [simulationSpeed, setSimulationSpeed] = useState(100);

  // State for the help popover.
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);

  // -------------------------
  // Simulation Calculation Functions
  // -------------------------
  const addQuantumNoise = useCallback(
    (value) => value + (Math.random() - 0.5) * 2 * quantumNoiseLevel,
    [quantumNoiseLevel]
  );

  const calculateElectronPosition = useCallback(
    (t) => Math.sin(t * electronFrequency) * Math.exp(-t * decayRate),
    [electronFrequency, decayRate]
  );

  const calculatePhotonEmission = useCallback(
    (t) => Math.cos(t * photonFrequency) * Math.exp(-t * decayRate),
    [photonFrequency, decayRate]
  );

  const calculateInteraction = useCallback(
    (electron, photon) => interactionStrength * electron * photon,
    [interactionStrength]
  );

  const calculateBlochSphereCoordinates = useCallback(
    (t) => {
      const theta = t * electronFrequency;
      const phi = t * photonFrequency;
      return {
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
      };
    },
    [electronFrequency, photonFrequency]
  );

  const applyQuantumGate = useCallback((qubitState, gateType) => {
    switch (gateType) {
      case 'hadamard':
        return {
          x: (qubitState.x + qubitState.z) / Math.sqrt(2),
          y: qubitState.y,
          z: (qubitState.z - qubitState.x) / Math.sqrt(2),
        };
      case 'pauliX':
        return { x: qubitState.x, y: -qubitState.y, z: -qubitState.z };
      case 'pauliY':
        return { x: -qubitState.x, y: qubitState.y, z: -qubitState.z };
      case 'pauliZ':
        return { x: -qubitState.x, y: -qubitState.y, z: qubitState.z };
      case 'toffoli':
        if (qubitState.x === 1 && qubitState.y === 1) {
          return { ...qubitState, z: -qubitState.z };
        }
        return qubitState;
      default:
        return qubitState;
    }
  }, []);

  const calculateQuantumCircuit = useCallback(() => {
    const initialState = calculateBlochSphereCoordinates(time);
    const gateSequence = [gateType, 'pauliX', 'pauliY', 'pauliZ'];
    let currentState = initialState;

    return gateSequence.map((gate, index) => {
      currentState = applyQuantumGate(currentState, gate);
      return {
        ...currentState,
        step: index + 1,
        gate: gate,
      };
    });
  }, [calculateBlochSphereCoordinates, applyQuantumGate, gateType, time]);

  const calculateEntanglement = useCallback(() => {
    const qubitA = calculateBlochSphereCoordinates(time);
    const qubitB = {
      x: -qubitA.x,
      y: -qubitA.y,
      z: -qubitA.z,
    };
    return { qubitA, qubitB, t: time };
  }, [calculateBlochSphereCoordinates, time]);

  // -------------------------
  // Memoized Calculations
  // -------------------------
  const electronPos = useMemo(
    () => addQuantumNoise(calculateElectronPosition(time)),
    [time, calculateElectronPosition, addQuantumNoise]
  );

  const photonEmission = useMemo(
    () => addQuantumNoise(calculatePhotonEmission(time)),
    [time, calculatePhotonEmission, addQuantumNoise]
  );

  const interaction = useMemo(
    () => calculateInteraction(electronPos, photonEmission),
    [electronPos, photonEmission, calculateInteraction]
  );

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  useEffect(() => {
    setData((prevData) => [
      ...prevData.slice(-100),
      {
        t: time,
        electronPosition: electronPos,
        photonEmission: photonEmission,
        interaction: interaction,
      },
    ]);

    const blochCoords = calculateBlochSphereCoordinates(time);
    setBlochSphereData((prevData) => [
      ...prevData.slice(-100),
      { ...blochCoords, t: time },
    ]);

    const circuitData = calculateQuantumCircuit();
    setQuantumCircuitData(circuitData);

    const entanglementPoint = calculateEntanglement();
    setEntanglementData((prevData) => [
      ...prevData.slice(-100),
      entanglementPoint,
    ]);
  }, [
    time,
    electronPos,
    photonEmission,
    interaction,
    calculateBlochSphereCoordinates,
    calculateQuantumCircuit,
    calculateEntanglement,
  ]);

  // -------------------------
  // Event Handlers
  // -------------------------
  const toggleSimulation = () => setIsRunning((prev) => !prev);

  const resetSimulation = () => {
    setTime(0);
    setData([]);
    setBlochSphereData([]);
    setQuantumCircuitData([]);
    setEntanglementData([]);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCustomCircuitChange = (event) => {
    setCustomCircuit(event.target.value);
  };

  // -------------------------
  // Real-Time Statistics
  // -------------------------
  const averages = useMemo(() => {
    if (data.length === 0) return { avgElectron: 0, avgPhoton: 0, avgInteraction: 0 };
    const recentData = data.slice(-20);
    const sum = recentData.reduce(
      (acc, curr) => ({
        avgElectron: acc.avgElectron + curr.electronPosition,
        avgPhoton: acc.avgPhoton + curr.photonEmission,
        avgInteraction: acc.avgInteraction + curr.interaction,
      }),
      { avgElectron: 0, avgPhoton: 0, avgInteraction: 0 }
    );
    const count = recentData.length;
    return {
      avgElectron: (sum.avgElectron / count).toFixed(2),
      avgPhoton: (sum.avgPhoton / count).toFixed(2),
      avgInteraction: (sum.avgInteraction / count).toFixed(2),
    };
  }, [data]);

  // -------------------------
  // Conditional Rendering for Training Modes
  // -------------------------
  const renderMainDisplay = () => {
    if (selectedVisualization === 'quantumAiTraining') {
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
    } else if (selectedVisualization === 'quantumAiModel') {
      return (
        <Suspense
          fallback={
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">Loading Quantum AI Model...</Typography>
            </Box>
          }
        >
          <QuantumAiAgentModel />
        </Suspense>
      );
    } else {
      return (
        <VisualizationDisplay
          selectedVisualization={selectedVisualization}
          data={data}
          blochSphereData={blochSphereData}
          quantumCircuitData={quantumCircuitData}
          entanglementData={entanglementData}
          customCircuit={customCircuit}
        />
      );
    }
  };

  // -------------------------
  // Debug Info Section (for development)
  // -------------------------
  const debugInfo = useMemo(() => ({
    electronFrequency,
    photonFrequency,
    decayRate,
    interactionStrength,
    quantumNoiseLevel,
    simulationSpeed,
    qubitCount,
    gateType,
    customCircuit,
    selectedVisualization,
  }), [
    electronFrequency,
    photonFrequency,
    decayRate,
    interactionStrength,
    quantumNoiseLevel,
    simulationSpeed,
    qubitCount,
    gateType,
    customCircuit,
    selectedVisualization,
  ]);

  // -------------------------
  // Render Component
  // -------------------------
  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto', mt: 2 }}>
      {/* Card Header */}
      <CardHeader title="Advanced Quantum Computing and QED Visualization Suite" />

      {/* Card Content */}
      <CardContent>
        <Grid container spacing={2}>
          {/* Main Display Section (standard visualization or training module) */}
          <Grid item xs={12} md={8}>
            {renderMainDisplay()}
          </Grid>
          {/* Visualization Controls Section */}
          <Grid item xs={12} md={4}>
            <VisualizationControls
              electronFrequency={electronFrequency}
              setElectronFrequency={setElectronFrequency}
              photonFrequency={photonFrequency}
              setPhotonFrequency={setPhotonFrequency}
              decayRate={decayRate}
              setDecayRate={setDecayRate}
              interactionStrength={interactionStrength}
              setInteractionStrength={setInteractionStrength}
              quantumNoiseLevel={quantumNoiseLevel}
              setQuantumNoiseLevel={setQuantumNoiseLevel}
              selectedVisualization={selectedVisualization}
              setSelectedVisualization={setSelectedVisualization}
              qubitCount={qubitCount}
              setQubitCount={setQubitCount}
              gateType={gateType}
              setGateType={setGateType}
              isRunning={isRunning}
              toggleSimulation={toggleSimulation}
              resetSimulation={resetSimulation}
              customCircuit={customCircuit}
              handleCustomCircuitChange={handleCustomCircuitChange}
              simulationSpeed={simulationSpeed}
              setSimulationSpeed={setSimulationSpeed}
            />
          </Grid>
        </Grid>
        {/* Explanation Section */}
        <ExplanationSection />
        {/* Help Icon and Popover for Additional Information */}
        <Box sx={{ mt: 2 }}>
          <IconButton onClick={handlePopoverOpen} aria-label="Learn more">
            <HelpIcon />
          </IconButton>
          <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Quantum Computing Concepts</Typography>
              <Typography variant="body2">
                Explore fundamental concepts like superposition, entanglement, and quantum gates.
                Adjust parameters to see how they affect quantum states and interactions.
              </Typography>
            </Box>
          </Popover>
        </Box>
        {/* Display current simulation time and status */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            Simulation Time: {time.toFixed(1)} s
          </Typography>
          <Typography variant="body2">
            Status: {isRunning ? 'Running' : 'Paused'}
          </Typography>
        </Box>
        {/* Display real-time simulation averages */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Average Electron Position: {averages.avgElectron}
          </Typography>
          <Typography variant="body2">
            Average Photon Emission: {averages.avgPhoton}
          </Typography>
          <Typography variant="body2">
            Average Interaction: {averages.avgInteraction}
          </Typography>
        </Box>
        {/* Debug Information Section */}
        <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="subtitle1" gutterBottom>
            Debug Info (Simulation Parameters)
          </Typography>
          {Object.entries(debugInfo).map(([key, value]) => (
            <Typography key={key} variant="caption" display="block">
              {key}: {value.toString()}
            </Typography>
          ))}
        </Paper>
      </CardContent>
    </Card>
  );
};

export default QEDVisualization;
