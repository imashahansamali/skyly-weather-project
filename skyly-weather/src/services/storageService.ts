import AsyncStorage from
  '@react-native-async-storage/async-storage';

import type {
  City,
  TemperatureUnit,
} from '../types/weather';

const KEYS = {
  cities: 'skyly:cities:v1',
  unit: 'skyly:unit:v1',
  selected: 'skyly:selected:v1',
};

function isCity(value: unknown): value is City {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const city = value as Partial<City>;

  return (
    typeof city.id === 'string' &&
    typeof city.name === 'string' &&
    typeof city.country === 'string' &&
    typeof city.latitude === 'number' &&
    Number.isFinite(city.latitude) &&
    Math.abs(city.latitude) <= 90 &&
    typeof city.longitude === 'number' &&
    Number.isFinite(city.longitude) &&
    Math.abs(city.longitude) <= 180
  );
}

export async function getSavedCities(): Promise<
  City[]
> {
  const raw = await AsyncStorage.getItem(
    KEYS.cities
  );

  if (!raw) {
    return [];
  }

  const value: unknown = JSON.parse(raw);

  if (!Array.isArray(value)) {
    throw new Error(
      'Saved cities could not be read.'
    );
  }

  return value.filter(isCity);
}

export async function setSavedCities(
  cities: City[]
): Promise<void> {
  await AsyncStorage.setItem(
    KEYS.cities,
    JSON.stringify(cities)
  );
}

export async function getSelectedCity(): Promise<
  City | null
> {
  const raw = await AsyncStorage.getItem(
    KEYS.selected
  );

  if (!raw) {
    return null;
  }

  const city: unknown = JSON.parse(raw);

  return isCity(city) ? city : null;
}

export async function setSelectedCity(
  city: City
): Promise<void> {
  await AsyncStorage.setItem(
    KEYS.selected,
    JSON.stringify(city)
  );
}

export async function getUnit(): Promise<
  TemperatureUnit
> {
  const value = await AsyncStorage.getItem(
    KEYS.unit
  );

  return value === 'fahrenheit'
    ? 'fahrenheit'
    : 'celsius';
}

export async function setUnit(
  unit: TemperatureUnit
): Promise<void> {
  await AsyncStorage.setItem(KEYS.unit, unit);
}