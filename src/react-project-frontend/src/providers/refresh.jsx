import { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export function RefreshProvider({ children }) {
  const [refresh, setRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh: () => setRefresh((prev) => !prev) }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}
