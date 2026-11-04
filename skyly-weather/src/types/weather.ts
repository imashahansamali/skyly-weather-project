export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type City = {
  id: string;
  name: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
};

export type HourForecast = {
  time: string;
  temperature: number | null;
  code: number | null;
  rainChance: number | null;
};

export type DayForecast = {
  date: string;
  code: number | null;
  high: number | null;
  low: number | null;
  rainChance: number | null;
  sunrise: string;
  sunset: string;
};

export type Weather = {
  city: City;
  unit: TemperatureUnit;
  timezone: string;
  localTime: string;
  fetchedAt: string;

  current: {
    temperature: number | null;
    feelsLike: number | null;
    humidity: number | null;
    wind: number | null;
    code: number | null;
    isDay: boolean;
    rainChance: number | null;
  };

  hours: HourForecast[];
  days: DayForecast[];
};

export const DEFAULT_CITY: City = {
  id: 'geonames:1248991',
  name: 'Colombo',
  country: 'Sri Lanka',
  region: 'Western Province',
  latitude: 6.9319,
  longitude: 79.8478,
};

export const POPULAR_CITIES: City[] = [
  DEFAULT_CITY,
  {
    id: 'geonames:1241622',
    name: 'Kandy',
    country: 'Sri Lanka',
    region: 'Central Province',
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    id: 'geonames:1246294',
    name: 'Galle',
    country: 'Sri Lanka',
    region: 'Southern Province',
    latitude: 6.0367,
    longitude: 80.217,
  },
  {
    id: 'geonames:1242833',
    name: 'Jaffna',
    country: 'Sri Lanka',
    region: 'Northern Province',
    latitude: 9.6685,
    longitude: 80.0074,
  },
];

export function cityKey(city: City): string {
  return (
    `${city.latitude.toFixed(3)},` +
    `${city.longitude.toFixed(3)}`
  );
}