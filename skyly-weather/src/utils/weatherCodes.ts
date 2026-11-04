import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];

type WeatherInfo = {
  label: string;
  icon: IconName;
  color: string;
};

export function weatherInfo(
  code: number | null,
  isDay = true
): WeatherInfo {
  if (code === 0) {
    return {
      label: 'Clear sky',
      icon: isDay ? 'sunny' : 'moon',
      color: '#D48A00',
    };
  }

  if (code === 1 || code === 2) {
    return {
      label: 'Partly cloudy',
      icon: isDay ? 'partly-sunny' : 'cloudy-night',
      color: '#4584C6',
    };
  }

  if (code === 3) {
    return {
      label: 'Overcast',
      icon: 'cloudy',
      color: '#657A95',
    };
  }

  if (code === 45 || code === 48) {
    return {
      label: 'Fog',
      icon: 'cloud',
      color: '#657A95',
    };
  }

  if ([51, 53, 55, 56, 57].includes(code ?? -1)) {
    return {
      label: 'Drizzle',
      icon: 'rainy',
      color: '#3980C8',
    };
  }

  if (
    [61, 63, 65, 66, 67, 80, 81, 82].includes(
      code ?? -1
    )
  ) {
    return {
      label: 'Rain',
      icon: 'rainy',
      color: '#3980C8',
    };
  }

  if (
    [71, 73, 75, 77, 85, 86].includes(code ?? -1)
  ) {
    return {
      label: 'Snow',
      icon: 'snow',
      color: '#3980C8',
    };
  }

  if ([95, 96, 99].includes(code ?? -1)) {
    return {
      label: 'Thunderstorm',
      icon: 'thunderstorm',
      color: '#8260C1',
    };
  }

  return {
    label: 'Conditions unavailable',
    icon: 'help-circle-outline',
    color: '#657A95',
  };
}