import { useState, useEffect, useCallback } from 'react';

const PRO_STORAGE_KEY = 'proStatus';
const INITIAL_CREDITS = 50;

type ProStatus = {
  isPro: boolean;
  credits: number;
};

// Lazy initializer for useState, reads from localStorage only on initial load.
const getInitialState = (): ProStatus => {
  try {
    const storedStatus = window.localStorage.getItem(PRO_STORAGE_KEY);
    if (storedStatus) {
      return JSON.parse(storedStatus);
    }
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
  }
  // Default for first-time users or if localStorage fails
  return { isPro: true, credits: INITIAL_CREDITS };
};


export const useProStatus = () => {
  const [status, setStatus] = useState<ProStatus>(getInitialState);

  // Persist status changes to localStorage whenever status state changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(status));
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
    }
  }, [status]);

  const useCredit = useCallback(() => {
    setStatus(prevStatus => {
      // Ensure we don't go below zero and user has enough credits
      if (prevStatus.credits >= 10) {
        return { ...prevStatus, credits: prevStatus.credits - 10 };
      }
      return prevStatus;
    });
  }, []);

  const renewCredits = useCallback(() => {
    setStatus(prevStatus => ({
      ...prevStatus,
      credits: INITIAL_CREDITS
    }));
  }, []);

  return {
    ...status,
    useCredit,
    renewCredits,
  };
};