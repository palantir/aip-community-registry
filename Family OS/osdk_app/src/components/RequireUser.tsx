import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AppContext, AppContextType } from '../contexts/AppContext';

export const RequireUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { selectedUser } = useContext(AppContext) as AppContextType;
    return selectedUser ? <>{children}</> : <Navigate to="/" replace />;
};
