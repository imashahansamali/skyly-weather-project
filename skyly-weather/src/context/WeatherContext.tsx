import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  DEFAULT_CITY,
  cityKey,
  type City,
} from '../types/weather';

import * as storage from
  '../services/storageService';

type WeatherValue = {
  selectedCity: City;
  savedCities: City[];
  ready: boolean;
  storageError: string | null;
  dismissStorageError: () => void;

  selectCity: (city: City) => Promise<void>;
  saveCity: (city: City) => Promise<void>;
  removeCity: (city: City) => Promise<void>;
  isSaved: (city: City) => boolean;
};

const WeatherContext =
  createContext<WeatherValue | null>(null);

export function WeatherProvider({
  children,
}: PropsWithChildren) {
  const [selectedCity, setSelectedCity] =
    useState<City>(DEFAULT_CITY);

  const [savedCities, setSavedCities] =
    useState<City[]>([]);

  const savedRef = useRef<City[]>([]);

  const [ready, setReady] = useState(false);

  const [storageError, setStorageError] =
    useState<string | null>(null);

  const queue = useRef<Promise<void>>(
    Promise.resolve()
  );

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      storage.getSavedCities(),
      storage.getSelectedCity(),
    ]).then(([saved, selected]) => {
      if (!active) {
        return;
      }

      if (saved.status === 'fulfilled') {
        savedRef.current = saved.value;
        setSavedCities(saved.value);
      }

      if (
        selected.status === 'fulfilled' &&
        selected.value
      ) {
        setSelectedCity(selected.value);
      }

      if (
        saved.status === 'rejected' ||
        selected.status === 'rejected'
      ) {
        setStorageError(
          'Some preferences could not be loaded. ' +
          'Your current session still works.'
        );
      }

      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  function enqueue(
    operation: () => Promise<void>
  ): Promise<void> {
    const result =
      queue.current.then(operation);

    queue.current = result.catch(() => {});

    return result;
  }

  function selectCity(city: City) {
    return enqueue(async () => {
      await storage.setSelectedCity(city);
      setSelectedCity(city);
    });
  }

  function saveCity(city: City) {
    return enqueue(async () => {
      const list = savedRef.current;

      const exists = list.some(
        (item) =>
          cityKey(item) === cityKey(city)
      );

      if (exists) {
        return;
      }

      const next = [...list, city];

      await storage.setSavedCities(next);

      savedRef.current = next;
      setSavedCities(next);
    });
  }

  function removeCity(city: City) {
    return enqueue(async () => {
      const next = savedRef.current.filter(
        (item) =>
          cityKey(item) !== cityKey(city)
      );

      await storage.setSavedCities(next);

      savedRef.current = next;
      setSavedCities(next);
    });
  }

  function isSaved(city: City) {
    return savedCities.some(
      (item) =>
        cityKey(item) === cityKey(city)
    );
  }

  return (
    <WeatherContext.Provider
      value={{
        selectedCity,
        savedCities,
        ready,
        storageError,
        selectCity,
        saveCity,
        removeCity,
        isSaved,
        dismissStorageError: () =>
          setStorageError(null),
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const value = useContext(WeatherContext);

  if (!value) {
    throw new Error(
      'WeatherProvider is missing'
    );
  }

  return value;
}