// src/components/VisualizationControls.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  TextField,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * VisualizationControls Component
 *
 * This component provides UI controls for selecting and adjusting parameters
 * for various quantum visualization tools. Users can choose the visualization,
 * adjust both basic and advanced simulation parameters, and control simulation playback.
 *
 * The component includes:
 * - A visualization selector (with additional options for training modes).
 * - Basic simulation controls (e.g., electron frequency).
 * - Advanced settings (e.g., photon frequency, decay rate, interaction strength,
 *   quantum noise level, and simulation speed) in a collapsible section.
 * - Conditional controls for quantum circuits and custom circuits.
 * - Playback controls (Pause/Resume and Reset).
 */
const VisualizationControls = ({
  electronFrequency,
  setElectronFrequency,
  photonFrequency,
  setPhotonFrequency,
  decayRate,
  setDecayRate,
  interactionStrength,
  setInteractionStrength,
  quantumNoiseLevel,
  setQuantumNoiseLevel,
  simulationSpeed,
  setSimulationSpeed,
  selectedVisualization,
  setSelectedVisualization,
  qubitCount,
  setQubitCount,
  gateType,
  setGateType,
  isRunning,
  toggleSimulation,
  resetSimulation,
  customCircuit,
  handleCustomCircuitChange,
}) => {
  // Local state for toggling the display of advanced settings.
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Default advanced settings for reset functionality.
  const defaultAdvancedSettings = {
    photonFrequency: 2,
    decayRate: 0.1,
    interactionStrength: 0.5,
    quantumNoiseLevel: 0.1,
    simulationSpeed: 100,
  };

  // Function to reset advanced settings.
  const resetAdvancedSettings = () => {
    setPhotonFrequency(defaultAdvancedSettings.photonFrequency);
    setDecayRate(defaultAdvancedSettings.decayRate);
    setInteractionStrength(defaultAdvancedSettings.interactionStrength);
    setQuantumNoiseLevel(defaultAdvancedSettings.quantumNoiseLevel);
    setSimulationSpeed(defaultAdvancedSettings.simulationSpeed);
  };

  return (
    <Box>
      {/* Visualization Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="visualization-select-label">Select Visualization</InputLabel>
        <Select
          labelId="visualization-select-label"
          value={selectedVisualization}
          label="Select Visualization"
          onChange={(event) => setSelectedVisualization(event.target.value)}
        >
          <MenuItem value="qed">QED Interaction</MenuItem>
          <MenuItem value="bloch">Bloch Sphere</MenuItem>
          <MenuItem value="circuit">Quantum Circuit</MenuItem>
          <MenuItem value="entanglement">Quantum Entanglement</MenuItem>
          <MenuItem value="customCircuit">Custom Quantum Circuit</MenuItem>
          <MenuItem value="grover">Grover's Algorithm</MenuItem>
          <MenuItem value="shor">Shor's Algorithm</MenuItem>
          <MenuItem value="errorCorrection">Quantum Error Correction</MenuItem>
          <MenuItem value="quantumWalk">Quantum Walk</MenuItem>
          <MenuItem value="densityMatrix">Density Matrix</MenuItem>
          <MenuItem value="teleportation">Quantum Teleportation</MenuItem>
          <MenuItem value="gateSimulator">Quantum Gate Simulator</MenuItem>
          <MenuItem value="qft">Quantum Fourier Transform</MenuItem>
          <MenuItem value="hamiltonianEvolution">Hamiltonian Evolution</MenuItem>
          {/* New training modes */}
          <MenuItem value="quantumAiTraining">Quantum AI Training</MenuItem>
          <MenuItem value="quantumNeuralNetworkTraining">Quantum Neural Network Training</MenuItem>
        </Select>
      </FormControl>

      {/* Basic Simulation Control */}
      <Box sx={{ my: 2 }}>
        <Tooltip title="Adjust the frequency of the electron's oscillation" arrow>
          <Typography gutterBottom>Electron Frequency</Typography>
        </Tooltip>
        <Slider
          value={electronFrequency}
          onChange={(event, value) => setElectronFrequency(value)}
          min={0.1}
          max={5}
          step={0.1}
          valueLabelDisplay="auto"
          aria-labelledby="electron-frequency-slider"
          marks
        />
      </Box>

      {/* Toggle Advanced Settings */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Advanced Simulation Settings
        </Typography>
        <IconButton onClick={() => setShowAdvanced((prev) => !prev)} aria-label="Toggle advanced settings">
          {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={showAdvanced}>
        {/* Advanced Simulation Controls */}
        <Box sx={{ my: 2 }}>
          <Tooltip title="Adjust the frequency of the photon's oscillation" arrow>
            <Typography gutterBottom>Photon Frequency</Typography>
          </Tooltip>
          <Slider
            value={photonFrequency}
            onChange={(event, value) => setPhotonFrequency(value)}
            min={0.1}
            max={10}
            step={0.1}
            valueLabelDisplay="auto"
            aria-labelledby="photon-frequency-slider"
            marks
          />
          <Tooltip title="Adjust the decay rate" arrow>
            <Typography gutterBottom sx={{ mt: 2 }}>
              Decay Rate
            </Typography>
          </Tooltip>
          <Slider
            value={decayRate}
            onChange={(event, value) => setDecayRate(value)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="decay-rate-slider"
            marks
          />
          <Tooltip title="Adjust the interaction strength" arrow>
            <Typography gutterBottom sx={{ mt: 2 }}>
              Interaction Strength
            </Typography>
          </Tooltip>
          <Slider
            value={interactionStrength}
            onChange={(event, value) => setInteractionStrength(value)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="interaction-strength-slider"
            marks
          />
          <Tooltip title="Adjust the quantum noise level" arrow>
            <Typography gutterBottom sx={{ mt: 2 }}>
              Quantum Noise Level
            </Typography>
          </Tooltip>
          <Slider
            value={quantumNoiseLevel}
            onChange={(event, value) => setQuantumNoiseLevel(value)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            aria-labelledby="quantum-noise-level-slider"
            marks
          />
          <Tooltip title="Adjust the simulation update interval (in ms)" arrow>
            <Typography gutterBottom sx={{ mt: 2 }}>
              Simulation Speed (ms)
            </Typography>
          </Tooltip>
          <Slider
            value={simulationSpeed}
            onChange={(e, value) => setSimulationSpeed(value)}
            min={50}
            max={1000}
            step={50}
            valueLabelDisplay="auto"
            aria-labelledby="simulation-speed-slider"
            marks
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={resetAdvancedSettings}>
              Reset Advanced Settings
            </Button>
          </Box>
        </Box>
      </Collapse>

      {/* Conditional Controls for Quantum Circuit */}
      {selectedVisualization === 'circuit' && (
        <Box sx={{ my: 2 }}>
          <Tooltip title="Select the number of qubits in the circuit" arrow>
            <Typography gutterBottom>Number of Qubits</Typography>
          </Tooltip>
          <Slider
            value={qubitCount}
            onChange={(event, value) => setQubitCount(value)}
            min={1}
            max={5}
            step={1}
            valueLabelDisplay="auto"
            aria-labelledby="qubit-count-slider"
            marks
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="gate-type-select-label">Gate Type</InputLabel>
            <Select
              labelId="gate-type-select-label"
              value={gateType}
              label="Gate Type"
              onChange={(event) => setGateType(event.target.value)}
            >
              <MenuItem value="hadamard">Hadamard</MenuItem>
              <MenuItem value="pauliX">Pauli-X</MenuItem>
              <MenuItem value="pauliY">Pauli-Y</MenuItem>
              <MenuItem value="pauliZ">Pauli-Z</MenuItem>
              <MenuItem value="toffoli">Toffoli</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Custom Circuit Input */}
      {selectedVisualization === 'customCircuit' && (
        <Box sx={{ my: 2 }}>
          <Typography gutterBottom>Custom Quantum Circuit</Typography>
          <TextField
            fullWidth
            label="Circuit Definition"
            variant="outlined"
            value={customCircuit}
            onChange={handleCustomCircuitChange}
            placeholder="e.g., H q0; CX q0,q1;"
            multiline
            rows={4}
          />
          <Typography variant="body2" color="textSecondary">
            Define your custom circuit using a simple syntax. For example: <code>H q0; CX q0,q1;</code>
          </Typography>
        </Box>
      )}

      {/* Simulation Playback Controls */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button variant="contained" onClick={toggleSimulation}>
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
        <Button variant="outlined" onClick={resetSimulation}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default VisualizationControls;
