import React from 'react';
import { Outlet } from "react-router-dom";
import { AppContextProvider } from '../contexts/AppContext';

export const AppLayout: React.FC = () => {
    return (
        <AppContextProvider>
            <Outlet />
        </AppContextProvider>
    );
};