import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DeploymentRecord, HistoryContextType } from '../types';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'bolt-landing-page-history';

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setDeployments(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading deployment history:', error);
    }
  }, []);

  // Save to localStorage whenever deployments change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deployments));
    } catch (error) {
      console.error('Error saving deployment history:', error);
    }
  }, [deployments]);

  const addDeployment = (deployment: Omit<DeploymentRecord, 'id'>) => {
    const newDeployment: DeploymentRecord = {
      ...deployment,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    
    setDeployments(prev => [newDeployment, ...prev]); // Add to beginning for newest first
  };

  const removeDeployment = (id: string) => {
    setDeployments(prev => prev.filter(deployment => deployment.id !== id));
  };

  const clearHistory = () => {
    setDeployments([]);
  };

  const value: HistoryContextType = {
    deployments,
    addDeployment,
    removeDeployment,
    clearHistory,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}; 