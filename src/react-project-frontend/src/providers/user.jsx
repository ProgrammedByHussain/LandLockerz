import React, { createContext, useState, useContext } from 'react';

// Step 1: Create a Context
const UserContext = createContext();

// Step 2: Create a Provider Component
export const UserProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');

  // Function to update the wallet address
  const updateWalletAddress = (address) => {
    setWalletAddress(address);
  };

  // Value object to be passed to the context
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