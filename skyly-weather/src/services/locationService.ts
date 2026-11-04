import * as Location from 'expo-location';
import type { City } from '../types/weather';

export async function getCurrentCity(): Promise<
  City
> {
  const permission =
    await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error(
      'Location access is off. Search manually, ' +
      'or enable permission in phone settings.'
    );
  }

  const enabled =
    await Location.hasServicesEnabledAsync();

  if (!enabled) {
    throw new Error(
      'Location services are off. Enable GPS ' +
      'or search for your city manually.'
    );
  }

  const position =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  const { latitude, longitude } = position.coords;

  let name = 'Current location';
  let country = '';
  let region: string | undefined;

  try {
    const [address] =
      await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

    if (address) {
      name =
        address.city ??
        address.subregion ??
        name;

      country = address.country ?? '';
      region = address.region ?? undefined;
    }
  } catch {
    // Coordinates still work without an address.
  }

  return {
    id:
      `location:${latitude.toFixed(3)},` +
      longitude.toFixed(3),
    name,
    country,
    region,
    latitude,
    longitude,
  };
}