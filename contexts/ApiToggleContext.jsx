import { createContext, useContext, useState } from "react";

const ApiToggleContext = createContext(null);

export const ApiToggleProvider = ({ children }) => {
  const [useAPI, setUseAPI] = useState(true);

  return (
    <ApiToggleContext.Provider value={{ useAPI, setUseAPI }}>
      {children}
    </ApiToggleContext.Provider>
  );
};

export const useApiToggle = () => {
  const context = useContext(ApiToggleContext);
  if (!context) {
    throw new Error("useApiToggle must be used inside ApiToggleProvider");
  }
  return context;
};
