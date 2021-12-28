import React, { createContext, useContext, useEffect, useState } from "react";
import { useConnectionStatus } from "./ConnectionContext";

type VisualizationContext = {
  documents: any[];
  updateVisualizedData: React.Dispatch<React.SetStateAction<any>>;
};

const VisualizeContext = createContext<VisualizationContext | null>(null);

type Props = {
  children: React.ReactNode;
};

export function VisualizeProvider({ children }: Props) {
  const [documents, setData] = useState([]);
  const { isConnected } = useConnectionStatus();

  useEffect(() => {
    if (!isConnected && documents.length) setData([]);
  }, [isConnected]);

  return (
    <VisualizeContext.Provider
      value={{ documents, updateVisualizedData: setData }}
    >
      {children}
    </VisualizeContext.Provider>
  );
}

export function useVisualizer() {
  const context = useContext(VisualizeContext);

  if (context === null)
    throw new Error(
      "useVisualizer can only be used within the VisualizeProvider"
    );

  return context;
}
