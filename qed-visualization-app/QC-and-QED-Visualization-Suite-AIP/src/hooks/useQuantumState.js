// src/hooks/useQuantumState.js

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to simulate the evolution of a quantum state.
 *
 * @param {any} initialState - The initial state value.
 * @param {Function} updateFunction - A function that receives the current state and returns the updated state.
 * @param {boolean} isRunning - Flag to indicate if the simulation is running.
 * @param {number} [intervalTime=100] - The interval time (in milliseconds) between state updates. Defaults to 100ms.
 * @returns {any} The current state.
 *
 * @example
 * const updateFn = (prevState) => ({ ...prevState, value: prevState.value + 1 });
 * const quantumState = useQuantumState({ value: 0 }, updateFn, isRunning, 100);
 */
const useQuantumState = (initialState, updateFunction, isRunning, intervalTime = 100) => {
  const [state, setState] = useState(initialState);

  // Use a ref to hold the latest update function without triggering re-renders
  const updateFunctionRef = useRef(updateFunction);
  useEffect(() => {
    updateFunctionRef.current = updateFunction;
  }, [updateFunction]);

  useEffect(() => {
    // If simulation is not running, do nothing
    if (!isRunning) {
      return;
    }
    // Set up an interval to update the state
    const intervalId = setInterval(() => {
      setState((prevState) => updateFunctionRef.current(prevState));
    }, intervalTime);

    // Clear the interval when the effect is cleaned up or isRunning/intervalTime changes
    return () => clearInterval(intervalId);
  }, [isRunning, intervalTime]);

  return state;
};

export default useQuantumState;
