import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Database } from '../database.types';

type Child = Database['public']['Tables']['children']['Row'];

interface ChildContextType {
  activeChild: Child | null;
  setActiveChild: (child: Child | null) => void;
}

const ChildContext = createContext<ChildContextType>({
  activeChild: null,
  setActiveChild: () => {},
});

export const useChildContext = () => useContext(ChildContext);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [activeChild, setActiveChildState] = useState<Child | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('activeChild');
    if (stored) {
      try {
        setActiveChildState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored activeChild');
      }
    }
  }, []);

  const setActiveChild = (child: Child | null) => {
    setActiveChildState(child);
    if (child) {
      localStorage.setItem('activeChild', JSON.stringify(child));
    } else {
      localStorage.removeItem('activeChild');
    }
  };

  return (
    <ChildContext.Provider value={{ activeChild, setActiveChild }}>
      {children}
    </ChildContext.Provider>
  );
}
