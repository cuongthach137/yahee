import React, { useState } from "react";
export const ProgressContext = React.createContext();
export const LoadingContext = React.createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <ProgressContext.Provider value={[progress, setProgress]}>
      <LoadingContext.Provider value={[loading, setLoading]}>
        {children}
      </LoadingContext.Provider>
    </ProgressContext.Provider>
  );
};
