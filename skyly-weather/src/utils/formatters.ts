import type { TemperatureUnit } from '../types/weather';

export function temp(
  value: number | null | undefined,
  unit: TemperatureUnit,
  suffix = false
): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }

  const symbol = unit === 'celsius' ? 'C' : 'F';

  return `${Math.round(value)}°${suffix ? symbol : ''}`;
}

export function numberLabel(
  value: number | null | undefined,
  suffix: string
): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }

  return `${Math.round(value)}${suffix}`;
}

// These strings already represent the selected city's local time.
export function localClock(iso: string): string {
  const match = /T(\d{2}):(\d{2})/.exec(iso);

  if (!match) {
    return '—';
  }

  const hour = Number(match[1]);
  const minutes = match[2];
  const period = hour >= 12 ? 'PM' : 'AM';

  return (
    `${hour % 12 || 12}` +
    `${minutes === '00' ? '' : `:${minutes}`} ${period}`
  );
}

export function localDate(
  iso: string,
  short = false
): string {
  const date = new Date(
    `${iso.slice(0, 10)}T12:00:00Z`
  );

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    weekday: short ? 'short' : 'long',
    day: 'numeric',
    month: 'short',
  });
}