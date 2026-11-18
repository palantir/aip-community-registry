// src/components/QuantumTeleportation.js

import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';

/**
 * QuantumTeleportation Component
 *
 * This component simulates the steps involved in quantum teleportation.
 * It demonstrates the process of transferring the state of qubit A to qubit C
 * through a series of steps that include entanglement creation, measurement,
 * and classical communication.
 *
 * The component maintains a step counter and displays a text description for
 * each step of the process. A button is provided to move to the next step.
 */
const QuantumTeleportation = () => {
  // State variable to track the current step in the teleportation process.
  const [step, setStep] = useState(0);
  // State variable to hold a description of the current state in the process.
  const [stateDescription, setStateDescription] = useState('Initial state |ψ⟩');

  /**
   * nextStep function
   *
   * Advances the simulation to the next step if the current step is less than 4.
   * It increments the step counter and updates the state description accordingly.
   */
  const nextStep = () => {
    if (step < 4) {
      const newStep = step + 1;
      setStep(newStep);
      updateStateDescription(newStep);
    }
  };

  /**
   * updateStateDescription function
   *
   * Updates the state description text based on the current step of the process.
   * @param {number} currentStep - The current step number in the teleportation process.
   */
  const updateStateDescription = (currentStep) => {
    switch (currentStep) {
      case 1:
        setStateDescription('Entangled state created between qubits B and C');
        break;
      case 2:
        setStateDescription('Bell measurement performed on qubits A and B');
        break;
      case 3:
        setStateDescription('Classical bits sent to qubit C');
        break;
      case 4:
        setStateDescription('Qubit C transformed to |ψ⟩');
        break;
      default:
        setStateDescription('Initial state |ψ⟩');
        break;
    }
  };

  return (
    <Box>
      {/* Title for the quantum teleportation demonstration */}
      <Typography variant="h6">Quantum Teleportation</Typography>
      {/* Brief description explaining what the demonstration represents */}
      <Typography paragraph>
        This visualization demonstrates the process of quantum teleportation, showing how the state of qubit A is transferred to qubit C.
      </Typography>
      {/* Button to advance to the next step in the process */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={nextStep}>
          Next Step
        </Button>
      </Box>
      {/* Display the current state description */}
      <Typography variant="body1">{stateDescription}</Typography>
      {/* 
        Additional visual elements (such as diagrams or animations) representing each step
        can be added here to enhance the demonstration.
      */}
    </Box>
  );
};

export default QuantumTeleportation;
