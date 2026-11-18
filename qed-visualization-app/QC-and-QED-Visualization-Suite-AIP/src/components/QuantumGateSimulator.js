// src/components/QuantumGateSimulator.js

import React, { useState } from 'react';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import BlochSphere3D from './BlochSphere3D';

/**
 * QuantumGateSimulator Component
 *
 * This component simulates the effect of quantum gates on a single qubit.
 * The qubit's state is represented as a point on the Bloch Sphere using its x, y, and z coordinates.
 * Users can select a quantum gate from a dropdown menu (Hadamard, Pauli-X, Pauli-Y, Pauli-Z)
 * and apply it to the qubit. The resulting state is then visualized on a 3D Bloch Sphere.
 */
const QuantumGateSimulator = () => {
  // State to represent the current qubit state (Bloch Sphere coordinates).
  // Initial state corresponds to |0⟩ (pointing to the north pole of the Bloch sphere).
  const [qubitState, setQubitState] = useState({ x: 0, y: 0, z: 1 });
  
  // State to hold the currently selected quantum gate.
  const [gate, setGate] = useState('Hadamard');

  // State to store data to be passed to the BlochSphere3D component for visualization.
  // Here, we keep an array of states (currently just one state).
  const [blochSphereData, setBlochSphereData] = useState([{ x: 0, y: 0, z: 1 }]);

  /**
   * applyGate function
   *
   * Applies the selected quantum gate to the current qubit state.
   * The new state is computed based on a simplified version of the gate operations.
   * After computing the new state, it updates the qubit state and Bloch sphere data.
   */
  const applyGate = () => {
    // Create a copy of the current qubit state.
    let newState = { ...qubitState };

    // Perform gate-specific operations to transform the qubit state.
    switch (gate) {
      case 'Hadamard':
        newState = {
          x: (qubitState.x + qubitState.z) / Math.sqrt(2),
          y: qubitState.y,
          z: (qubitState.z - qubitState.x) / Math.sqrt(2),
        };
        break;
      case 'Pauli-X':
        newState = {
          x: qubitState.x,
          y: -qubitState.y,
          z: -qubitState.z,
        };
        break;
      case 'Pauli-Y':
        newState = {
          x: -qubitState.x,
          y: qubitState.y,
          z: -qubitState.z,
        };
        break;
      case 'Pauli-Z':
        newState = {
          x: -qubitState.x,
          y: -qubitState.y,
          z: qubitState.z,
        };
        break;
      default:
        break;
    }

    // Update the state variables with the new qubit state.
    setQubitState(newState);
    setBlochSphereData([newState]);
  };

  return (
    <Box>
      {/* Title and description */}
      <Typography variant="h6">Quantum Gate Simulator</Typography>
      <Typography paragraph>
        Apply quantum gates to a qubit and observe the changes in its state on the Bloch Sphere.
      </Typography>
      
      {/* Gate selection dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="gate-select-label">Select Gate</InputLabel>
        <Select
          labelId="gate-select-label"
          value={gate}
          label="Select Gate"
          onChange={(event) => setGate(event.target.value)}
        >
          {/* List of available quantum gates */}
          <MenuItem value="Hadamard">Hadamard</MenuItem>
          <MenuItem value="Pauli-X">Pauli-X</MenuItem>
          <MenuItem value="Pauli-Y">Pauli-Y</MenuItem>
          <MenuItem value="Pauli-Z">Pauli-Z</MenuItem>
        </Select>
      </FormControl>

      {/* Button to apply the selected gate */}
      <Button variant="contained" onClick={applyGate}>
        Apply Gate
      </Button>

      {/* 3D Bloch Sphere visualization */}
      <Box sx={{ mt: 2, height: '400px' }}>
        <BlochSphere3D blochSphereData={blochSphereData} />
      </Box>
    </Box>
  );
};

export default QuantumGateSimulator;
