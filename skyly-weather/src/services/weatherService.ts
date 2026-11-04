import type { City, TemperatureUnit, Weather } from '../types/weather';

type ForecastResponse = {
  timezone: string;

  current: {
    time: string;
    temperature_2m: number | null;
    apparent_temperature: number | null;
    relative_humidity_2m: number | null;
    wind_speed_10m: number | null;
    weather_code: number | null;
    is_day: number;
  };

  hourly: {
    time: string[];
    temperature_2m: (number | null)[];
    weather_code: (number | null)[];
    precipitation_probability: (number | null)[];
  };

  daily: {
    time: string[];
    weather_code: (number | null)[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
};

type GeocodingResponse = {
  results?: {
    id: number;
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }[];
};

const cache = new Map<string, { time: number; weather: Weather }>();

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();

  if (signal?.aborted) {
    controller.abort();
  }

  signal?.addEventListener('abort', forwardAbort);
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        response.status === 429
          ? 'Too many requests. Please wait and retry.'
          : 'The weather service is unavailable. Please retry.'
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    if (controller.signal.aborted) {
      throw new Error(
        'The request timed out. Check your connection and retry.'
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        'Could not connect. Check your internet connection.'
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<City[]> {
  if (query.trim().length < 2) {
    return [];
  }

  const url =
    'https://geocoding-api.open-meteo.com/v1/search' +
    `?name=${encodeURIComponent(query.trim())}` +
    '&count=10&language=en&format=json';

  const data = await request<GeocodingResponse>(url, signal);

  return (data.results ?? []).map((city) => ({
    id: `geonames:${city.id}`,
    name: city.name,
    country: city.country ?? '',
    region: city.admin1,
    latitude: city.latitude,
    longitude: city.longitude,
  }));
}

export function normalizeForecast(
  data: ForecastResponse,
  city: City,
  unit: TemperatureUnit
): Weather {
  if (
    !data.current?.time ||
    !Array.isArray(data.hourly?.time) ||
    !Array.isArray(data.daily?.time)
  ) {
    throw new Error('Incomplete weather data. Please retry.');
  }

  const currentHour = data.current.time.slice(0, 13);
  let hourIndex = data.hourly.time.findIndex(
    (time) => time.slice(0, 13) === currentHour
  );

  if (hourIndex < 0) {
    hourIndex = data.hourly.time.findIndex(
      (time) => time >= data.current.time
    );
  }

  const start = hourIndex < 0 ? data.hourly.time.length : hourIndex;

  return {
    city,
    unit,
    timezone: data.timezone,
    localTime: data.current.time,
    fetchedAt: new Date().toISOString(),

    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      wind: data.current.wind_speed_10m,
      code: data.current.weather_code,
      isDay: data.current.is_day === 1,
      rainChance:
        hourIndex < 0
          ? null
          : data.hourly.precipitation_probability[hourIndex] ?? null,
    },

    hours: data.hourly.time.slice(start, start + 12).map((time, offset) => ({
      time,
      temperature: data.hourly.temperature_2m[start + offset] ?? null,
      code: data.hourly.weather_code[start + offset] ?? null,
      rainChance: data.hourly.precipitation_probability[start + offset] ?? null,
    })),

    days: data.daily.time.map((date, index) => ({
      date,
      high: data.daily.temperature_2m_max[index] ?? null,
      low: data.daily.temperature_2m_min[index] ?? null,
      code: data.daily.weather_code[index] ?? null,
      rainChance: data.daily.precipitation_probability_max[index] ?? null,
      sunrise: data.daily.sunrise[index] ?? '',
      sunset: data.daily.sunset[index] ?? '',
    })),
  };
}

export async function getWeather(
  city: City,
  unit: TemperatureUnit,
  signal?: AbortSignal,
  force = false
): Promise<Weather> {
  const key = `${city.latitude},${city.longitude},${unit}`;
  const cached = cache.get(key);

  if (!force && cached && Date.now() - cached.time < 5 * 60 * 1000) {
    return { ...cached.weather, city };
  }

  const url =
  'http://192.168.43.75:3000/api/weather' +
  `?latitude=${city.latitude}` +
  `&longitude=${city.longitude}` +
  `&temperature_unit=${unit}`;

  const data = await request<ForecastResponse>(url, signal);
  const weather = normalizeForecast(data, city, unit);

  cache.set(key, {
    time: Date.now(),
    weather,
  });

  return weather;
}