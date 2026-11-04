import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  City,
  Weather,
} from '../types/weather';

import {
  getWeather,
} from '../services/weatherService';

import {
  useSettings,
} from '../context/SettingsContext';

export function useWeatherData(city: City) {
  const { unit } = useSettings();

  const [data, setData] =
    useState<Weather | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const requestId = useRef(0);

  const controller =
    useRef<AbortController | null>(null);

  const load = useCallback(
    async (force = false) => {
      controller.current?.abort();

      const abort = new AbortController();
      controller.current = abort;

      const id = ++requestId.current;

      setLoading(true);
      setError(null);
      setData(null);

      try {
        const weather = await getWeather(
          city,
          unit,
          abort.signal,
          force
        );

        if (
          id === requestId.current &&
          !abort.signal.aborted
        ) {
          setData(weather);
        }
      } catch (e) {
        if (
          id === requestId.current &&
          !abort.signal.aborted
        ) {
          setError(
            e instanceof Error
              ? e.message
              : 'Unable to load weather.'
          );
        }
      } finally {
        if (
          id === requestId.current &&
          !abort.signal.aborted
        ) {
          setLoading(false);
        }
      }
    },
    [
      city.id,
      city.name,
      city.latitude,
      city.longitude,
      unit,
    ]
  );

  useEffect(() => {
    void load();

    return () => {
      requestId.current++;
      controller.current?.abort();
    };
  }, [load]);

  const current =
    data &&
    data.unit === unit &&
    data.city.latitude === city.latitude &&
    data.city.longitude === city.longitude
      ? data
      : null;

  return {
    data: current,
    loading:
      loading || (!current && !error),
    error,
    refresh: () => load(true),
  };
}