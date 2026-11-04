import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import type {
  TemperatureUnit,
} from '../types/weather';

import * as storage from
  '../services/storageService';

type SettingsValue = {
  unit: TemperatureUnit;
  ready: boolean;
  error: string | null;
  changeUnit: (
    unit: TemperatureUnit
  ) => Promise<void>;
  dismissError: () => void;
};

const SettingsContext =
  createContext<SettingsValue | null>(null);

export function SettingsProvider({
  children,
}: PropsWithChildren) {
  const [unit, setUnit] =
    useState<TemperatureUnit>('celsius');

  const [ready, setReady] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    storage
      .getUnit()
      .then((value) => {
        if (active) {
          setUnit(value);
        }
      })
      .catch(() => {
        if (active) {
          setError(
            'Could not read your temperature preference.'
          );
        }
      })
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function changeUnit(
    value: TemperatureUnit
  ) {
    await storage.setUnit(value);
    setUnit(value);
  }

  return (
    <SettingsContext.Provider
      value={{
        unit,
        ready,
        error,
        changeUnit,
        dismissError: () => setError(null),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const value = useContext(SettingsContext);

  if (!value) {
    throw new Error(
      'SettingsProvider is missing'
    );
  }

  return value;
}