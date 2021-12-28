/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useConnectionStatus } from "../ConnectionContext";

export function useFetch<T>() {
  const { isConnected } = useConnectionStatus();
  type Payload = {
    status: "idle" | "resolved" | "rejected" | "pending";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: T;
    error?: string;
  };

  const [{ data, status, error }, setPayload] = useState<Payload>({
    status: "idle",
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    if (!isConnected) {
      setPayload((prevPayload: Payload) => ({
        ...prevPayload,
        data: undefined,
      }));
    }
  }, [isConnected]);

  const setSafePayload = useSafeState(setPayload);

  const Fetch = useCallback(async (...args: [RequestInfo, RequestInit?]) => {
    setSafePayload((prevPayload: Payload) => ({
      ...prevPayload,
      status: "pending",
      error: undefined,
    }));

    if (args?.[1]?.headers) {
      args[1].headers = {
        ...args[1].headers,
        "Content-Type": "application/json",
      };
    } else {
      args[1] = { ...args[1], headers: { "Content-Type": "application/json" } };
    }

    try {
      const response = await fetch(...args);
      const data = await response.json();

      setSafePayload({
        status: "resolved",
        data,
        error: undefined,
      });
    } catch (error) {
      setSafePayload((prevPayload: Payload) => ({
        ...prevPayload,
        status: "rejected",
      }));
    } finally {
      setTimeout(() => {
        setSafePayload((prevPayload: Payload) => ({
          ...prevPayload,
          status: "idle",
        }));
      }, 5000);
    }
  }, []);

  return {
    data,
    status,
    error,
    Fetch,
  };
}

const useSafeState = (setState: React.Dispatch<React.SetStateAction<any>>) => {
  const mounted = useRef<boolean | null>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback((...args: [any]) => {
    if (mounted.current) setState(...args);
  }, []);
};
