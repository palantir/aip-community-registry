
// App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;