// src/components/ExplanationSection.js

import React from 'react';
import { 
  Typography, 
  Alert, 
  Box, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const ExplanationSection = () => (
  <Box sx={{ mt: 4, px: { xs: 2, sm: 4 } }}>
    {/* Main Explanation Title */}
    <Typography variant="h6" gutterBottom>
      Explanation
    </Typography>
    <Typography paragraph>
      This advanced visualization suite demonstrates key concepts in Quantum Electrodynamics (QED) and quantum computing. Below is an overview of each feature and what it represents:
    </Typography>
    
    {/* List of Features */}
    <List dense>
      <ListItem>
        <ListItemText
          primary="QED Interaction"
          secondary="Shows the interplay between electrons, photons, and their interactions. Visualizes how particles exchange photons and how this affects their behavior, highlighting fundamental QED processes."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Bloch Sphere"
          secondary="Represents the quantum state of a qubit in 3D space. It illustrates the superposition and phase of qubit states, providing an intuitive understanding of single-qubit operations."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Circuit"
          secondary="Illustrates the evolution of qubit states through various quantum gates. Users can observe how gates like Hadamard and Pauli matrices affect qubit states over time."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Entanglement"
          secondary="Demonstrates the entanglement phenomenon between two qubits. Visualizes correlations between qubits that are stronger than those allowed by classical physics."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Noise"
          secondary="Simulates the inherent uncertainty and decoherence in quantum systems. Shows how quantum states are affected by environmental interactions."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="3D Bloch Sphere"
          secondary="Provides an interactive 3D representation of qubit states. Users can rotate and zoom the sphere to better understand qubit orientations."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Custom Quantum Circuit Builder"
          secondary="Allows you to build and visualize your own quantum circuits using a simple syntax. Supports a variety of gates including advanced ones like Toffoli and controlled rotations."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Grover's Algorithm"
          secondary="Simulates the quantum search algorithm, showing probability amplitudes and how they amplify the desired state's likelihood."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Shor's Algorithm"
          secondary="Provides a simplified simulation of Shor's algorithm for integer factorization. Demonstrates the quantum period-finding process and its significance in breaking classical encryption methods."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Error Correction"
          secondary="Visualizes quantum error correction codes like the three-qubit bit-flip code. Shows how quantum information can be protected from errors due to decoherence and other quantum noise."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Walk"
          secondary="Simulates quantum walks on graphs, highlighting differences from classical random walks. Demonstrates faster spreading and interference effects inherent in quantum systems."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Density Matrix Representation"
          secondary="Displays the density matrix of qubit states, allowing exploration of mixed states and phenomena like decoherence and entanglement."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Teleportation"
          secondary="Visualizes the process of quantum state transfer between qubits. Demonstrates how a qubit's state can be transmitted using entanglement and classical communication."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Gate Simulator"
          secondary="Apply quantum gates to qubits and observe the effects in real-time on the Bloch Sphere. Supports gates like Hadamard, Pauli-X, Pauli-Y, and Pauli-Z."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Quantum Fourier Transform"
          secondary="Demonstrates the QFT algorithm step by step. Shows how quantum states are transformed in the frequency domain, a key component in algorithms like Shor's."
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Hamiltonian Evolution"
          secondary="Simulates time evolution of quantum states under a specified Hamiltonian. Allows exploration of quantum dynamics and how states evolve according to the Schrödinger equation."
        />
      </ListItem>
    </List>

    {/* Warning Alert */}
    <Box sx={{ mt: 4 }}>
      <Alert severity="warning" icon={<WarningIcon fontSize="inherit" />}>
        <Typography variant="subtitle1">Note</Typography>
        <Typography variant="body2">
          This application is intended for educational purposes and provides simplified models of complex quantum phenomena. Real quantum systems involve more intricate interactions and mathematical formulations.
        </Typography>
      </Alert>
    </Box>

    {/* Additional Information Section */}
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Typography paragraph>
        Each visualization is interactive and allows you to adjust parameters to see their effects on quantum states and processes. By exploring these features, you can gain a deeper understanding of quantum mechanics and quantum computing principles.
      </Typography>
      <Typography paragraph>
        For example, in the <strong>Custom Quantum Circuit Builder</strong>, you can construct circuits using gates like Hadamard (H), Controlled NOT (CX), and Toffoli (CCX), and observe how these affect multi-qubit systems. In the <strong>Shor's Algorithm</strong> simulation, you can input different numbers to factor and see how quantum period finding works in principle.
      </Typography>
      <Typography paragraph>
        The <strong>Density Matrix Representation</strong> provides insight into mixed states and how quantum information can be lost due to decoherence. The <strong>Quantum Error Correction</strong> feature shows how qubits can be protected from errors, which is essential for building reliable quantum computers.
      </Typography>
      <Typography paragraph>
        In the <strong>Hamiltonian Evolution</strong> section, you can define your own Hamiltonian matrices and observe how quantum states evolve over time, which is fundamental to understanding quantum dynamics.
      </Typography>
    </Box>
  </Box>
);

export default ExplanationSection;
