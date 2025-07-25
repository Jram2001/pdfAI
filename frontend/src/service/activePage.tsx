/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { ActiveNumberContextType } from '../types/global-types';

// Create the context with undefined as default and proper typing
const ActiveNumberContext = createContext<ActiveNumberContextType | undefined>(undefined);

// Custom hook for easy access (with error handling)
export function useActiveNumber(): ActiveNumberContextType {
    const context = useContext(ActiveNumberContext);
    if (!context) {
        throw new Error('useActiveNumber must be used within an ActiveNumberProvider');
    }
    return context;
}

// Define provider props
interface ActiveNumberProviderProps {
    children: ReactNode;
}

// Provider component
export function ActiveNumberProvider({ children }: ActiveNumberProviderProps) {
    const [activeNumber, setActiveNumber] = useState<number>(0);

    const increment = () => setActiveNumber(n => n + 1);
    const decrement = () => setActiveNumber(n => n - 1);
    const setNumber = (num: number) => setActiveNumber(num);

    return (
        <ActiveNumberContext.Provider value={{ activeNumber, increment, decrement, setNumber }}>
            {children}
        </ActiveNumberContext.Provider>
    );
}
