import React, { createContext, useContext, useState } from "react";

type Connection = {
  isConnected: boolean;
  updateStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConnectionContext = createContext<Connection | null>(null);

type Props = {
  children: React.ReactNode;
};

export function ConnectionProvider({ children }: Props) {
  const [isConnected, setConnectionStatus] = useState(false);

  return (
    <ConnectionContext.Provider
      value={{ isConnected, updateStatus: setConnectionStatus }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionStatus() {
  const context = useContext(ConnectionContext);

  if (context === null)
    throw new Error(
      "Connection status is only available within the connection context"
    );

  return context;
}
