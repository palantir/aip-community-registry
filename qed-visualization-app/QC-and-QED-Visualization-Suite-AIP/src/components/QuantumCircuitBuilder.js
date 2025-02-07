import React, { useState } from 'react';
import { Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';

/**
 * An array of available quantum gate options.
 * These options are used to populate the dropdown selection in the UI.
 */
const gateOptions = [
  'Hadamard',
  'Pauli-X',
  'Pauli-Y',
  'Pauli-Z',
  'CNOT',
  'Toffoli',
  'SWAP',
  'Phase',
];

/**
 * QuantumCircuitBuilder Component
 *
 * This component provides a user interface to build a quantum circuit.
 * Users can select a quantum gate from a dropdown and add it to the circuit.
 * The circuit is visualized using the React Flow library, which displays nodes (gates)
 * and edges (connections between gates).
 *
 * Props:
 * - customCircuit: A string representing a custom circuit defined by the user.
 * - onCircuitChange: A callback function to notify parent components of circuit changes.
 */
const QuantumCircuitBuilder = ({ customCircuit, onCircuitChange }) => {
  // State for managing the list of nodes (gates) in the circuit.
  const [nodes, setNodes] = useState([]);
  // State for managing the list of edges (connections) between nodes.
  const [edges, setEdges] = useState([]);
  // State for the currently selected gate from the dropdown.
  const [selectedGate, setSelectedGate] = useState('');

  /**
   * Handles changes to the nodes.
   * @param {Array} changes - The changes to be applied to the nodes.
   */
  const onNodesChange = (changes) => {
    setNodes((nds) => nds.map((node) => ({ ...node, ...changes })));
  };

  /**
   * Handles changes to the edges.
   * @param {Array} changes - The changes to be applied to the edges.
   */
  const onEdgesChange = (changes) => {
    setEdges((eds) => eds.map((edge) => ({ ...edge, ...changes })));
  };

  /**
   * Handles connection events between nodes by adding a new edge.
   * @param {Object} params - The parameters describing the connection.
   */
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  /**
   * Parses a custom circuit string provided via props.
   * The circuit string should be formatted as a series of commands separated by semicolons.
   * Each command contains a gate and its associated qubits.
   * The function creates new nodes and edges based on the parsed commands and updates the circuit.
   */
  const parseCustomCircuit = () => {
    // Split the custom circuit string into individual commands and trim whitespace.
    const commands = customCircuit.split(';').map((cmd) => cmd.trim());
    const newNodes = [];
    const newEdges = [];

    commands.forEach((cmd, index) => {
      if (cmd) {
        // Split each command into a gate type and a list of qubits.
        const [gate, qubits] = cmd.split(' ');
        // Create an array of qubit identifiers, if provided.
        const qubitList = qubits ? qubits.split(',') : [];
        // Generate a unique node ID using the gate name and its index.
        const nodeId = `${gate}-${index}`;
        // Create a new node with the gate label and a position based on its index.
        newNodes.push({
          id: nodeId,
          data: { label: `${gate} ${qubitList.join(',')}` },
          position: { x: index * 100, y: 80 },
        });
        // If not the first command, create an edge connecting this node to the previous node.
        if (index > 0) {
          newEdges.push({
            id: `e${index - 1}-${index}`,
            source: `${gate}-${index - 1}`,
            target: nodeId,
          });
        }
      }
    });

    // Update the nodes and edges state with the new circuit structure.
    setNodes(newNodes);
    setEdges(newEdges);
    // Notify the parent component of the circuit change.
    onCircuitChange(newNodes, newEdges);
  };

  /**
   * Adds a new node to the circuit for the currently selected gate.
   * If there are existing nodes, the new node is connected to the last one via an edge.
   */
  const addGateNode = () => {
    if (!selectedGate) return; // Do nothing if no gate is selected.

    const index = nodes.length;
    const nodeId = `${selectedGate}-${index}`;
    // Create a new node with the selected gate as its label.
    const newNode = {
      id: nodeId,
      data: { label: selectedGate },
      position: { x: index * 100, y: 80 },
    };

    // If there is at least one node, create an edge from the last node to the new node.
    const newEdge =
      nodes.length > 0
        ? {
            id: `e${nodes.length - 1}-${index}`,
            source: nodes[nodes.length - 1].id,
            target: nodeId,
          }
        : null;

    // Update the nodes state by appending the new node.
    setNodes((nds) => [...nds, newNode]);
    // If an edge was created, update the edges state accordingly.
    if (newEdge) {
      setEdges((eds) => [...eds, newEdge]);
      onCircuitChange([...nodes, newNode], [...edges, newEdge]);
    } else {
      onCircuitChange([...nodes, newNode], edges);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Gate Selection and Add Gate Button */}
      <div style={{ marginBottom: '16px' }}>
        <FormControl sx={{ minWidth: 120, marginRight: '16px' }}>
          <InputLabel id="gate-select-label">Gate</InputLabel>
          <Select
            labelId="gate-select-label"
            value={selectedGate}
            label="Gate"
            onChange={(e) => setSelectedGate(e.target.value)}
          >
            {/* Populate the dropdown with gate options */}
            {gateOptions.map((gate) => (
              <MenuItem key={gate} value={gate}>
                {gate}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Button to add the selected gate as a new node */}
        <Button variant="contained" onClick={addGateNode}>
          Add Gate
        </Button>
      </div>

      {/* React Flow visualization container */}
      <div style={{ height: '400px', border: '1px solid #ccc' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          {/* Additional UI elements provided by React Flow */}
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Button to parse a custom circuit string into nodes and edges */}
      <Button variant="contained" onClick={parseCustomCircuit} sx={{ mt: 2 }}>
        Parse Custom Circuit
      </Button>
    </div>
  );
};

export default QuantumCircuitBuilder;
