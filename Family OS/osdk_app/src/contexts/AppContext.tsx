/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
/* eslint-disable-next-line import/named */
import { Osdk } from '@osdk/client';
import { AipfFamilyMember } from '@aipf-osdk-frontend/sdk';

export interface AppContextType {
    selectedUser: Osdk.Instance<AipfFamilyMember> | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<Osdk.Instance<AipfFamilyMember> | null>>;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState<Osdk.Instance<AipfFamilyMember> | null>(null);

    const contextValue: AppContextType = {
        selectedUser,
        setSelectedUser,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
