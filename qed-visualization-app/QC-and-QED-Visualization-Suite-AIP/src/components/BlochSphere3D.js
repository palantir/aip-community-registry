// src/components/BlochSphere3D.js

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import { Vector3, GridHelper } from 'three';

/**
 * BlochSphere3D Component
 *
 * Renders a 3D representation of the Bloch Sphere using react-three-fiber.
 * It takes in an array of Bloch sphere states and always uses the latest state
 * to update the position of a vector (line) that represents the qubit's state.
 *
 * @param {Object[]} blochSphereData - Array of state objects, each with x, y, z coordinates.
 */
const BlochSphere3D = ({ blochSphereData }) => {
  // Retrieve the latest state or fallback to the default north pole position.
  const latestState = blochSphereData[blochSphereData.length - 1] || { x: 0, y: 0, z: 1 };

  return (
    <Canvas style={{ height: '400px', background: '#000' }}>
      <Scene latestState={latestState} />
    </Canvas>
  );
};

/**
 * Scene Component
 *
 * This component defines the 3D scene, including lighting, the Bloch sphere,
 * dynamic state vector, axes lines, grid helper, and interactive controls.
 *
 * @param {Object} latestState - The latest state with x, y, z coordinates.
 */
const Scene = React.memo(({ latestState }) => {
  const vectorRef = useRef();

  // Update the vector's geometry on every frame using the latest state.
  useFrame(() => {
    if (vectorRef.current) {
      const { x, y, z } = latestState;
      vectorRef.current.geometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(x, y, z),
      ]);
    }
  });

  // Memoize the initial points for the state vector line.
  const initialLinePoints = useMemo(
    () => [new Vector3(0, 0, 0), new Vector3(0, 0, 1)],
    []
  );

  // Create a grid helper for reference (positioned below the sphere).
  const gridHelper = useMemo(() => {
    const helper = new GridHelper(10, 10, 0x888888, 0x444444);
    helper.position.y = -1.2;
    return helper;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Bloch Sphere rendered as a wireframe sphere */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="lightblue" wireframe />
      </Sphere>
      
      {/* Dynamic vector representing the qubit state */}
      <Line
        ref={vectorRef}
        points={initialLinePoints}
        color="red"
        lineWidth={2}
      />
      
      {/* Axes Lines */}
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(2, 0, 0)]}
        color="white"
        lineWidth={1}
      />
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(0, 2, 0)]}
        color="white"
        lineWidth={1}
      />
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(0, 0, 2)]}
        color="white"
        lineWidth={1}
      />

      {/* Axes Labels */}
      <Html position={[2.2, 0, 0]} center>
        <div style={{ color: 'white', fontWeight: 'bold' }}>X</div>
      </Html>
      <Html position={[0, 2.2, 0]} center>
        <div style={{ color: 'white', fontWeight: 'bold' }}>Y</div>
      </Html>
      <Html position={[0, 0, 2.2]} center>
        <div style={{ color: 'white', fontWeight: 'bold' }}>Z</div>
      </Html>

      {/* Display state vector coordinates as an overlay */}
      <Html position={[0, -1.5, 0]} center>
        <div style={{ color: 'yellow', fontSize: '0.9rem' }}>
          {`State: (${latestState.x.toFixed(2)}, ${latestState.y.toFixed(2)}, ${latestState.z.toFixed(2)})`}
        </div>
      </Html>

      {/* Grid Helper */}
      <primitive object={gridHelper} />

      {/* OrbitControls allow user interaction */}
      <OrbitControls enableZoom enablePan />
    </>
  );
});

export default BlochSphere3D;
