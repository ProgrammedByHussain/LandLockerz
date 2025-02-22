import React, { createContext, useState, useContext, useEffect } from 'react';

// Step 1: Create a Context
const UserContext = createContext();

// Step 2: Create a Provider Component
export const UserProvider = ({ children }) => {
  // Load initial state from localStorage
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem('walletAddress') || '';
  });

  // Function to update the wallet address
  const updateWalletAddress = (address) => {
    setWalletAddress(address);
    localStorage.setItem('walletAddress', address); // Persist state
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const value = {
    walletAddress,
    updateWalletAddress,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Step 3: Create a custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
