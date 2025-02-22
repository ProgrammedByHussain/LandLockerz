// AppBarContext.js
import React, { createContext, useContext, useState } from 'react';

const AppBarContext = createContext();

export const useAppBar = () => useContext(AppBarContext);

export const AppBarProvider = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = () => {
    console.log("TESTSETS"); 
    setIsWalletConnected(true);
  };

  const disconnectWallet = () => {
    // Logic to disconnect the wallet
    setIsWalletConnected(false);
  };

  return (
    <AppBarContext.Provider value={{ isWalletConnected, connectWallet, disconnectWallet }}>
      {children}
    </AppBarContext.Provider>
  );
};