// Import React functions for context and state
import { createContext, useContext, useState } from "react";

// Create a new context to manage API toggle state
// This will allow us to switch between using API or local storage
const ApiToggleContext = createContext(null);

// Provider component: wraps the app and provides API toggle state to all children
export const ApiToggleProvider = ({ children }) => {
  //  State to track whether to use API or local storage
  const [useAPI, setUseAPI] = useState(true);

  //  Provide both the state and the setter to all child components
  return (
    <ApiToggleContext.Provider value={{ useAPI, setUseAPI }}>
      {children}
    </ApiToggleContext.Provider>
  );
};

// Custom hook to access API toggle state easily
export const useApiToggle = () => {
  const context = useContext(ApiToggleContext);

  // Safety check: ensure hook is used inside the provider
  if (!context) {
    throw new Error("useApiToggle must be used inside ApiToggleProvider");
  }

  // Return the context (state + setter)
  return context;
};
