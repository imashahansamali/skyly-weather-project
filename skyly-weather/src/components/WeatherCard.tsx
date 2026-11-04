import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type { Weather } from '../types/weather';
import { colors } from '../theme/colors';
import { temp } from '../utils/formatters';
import { weatherInfo } from '../utils/weatherCodes';

export default function WeatherCard({
  weather,
}: {
  weather: Weather;
}) {
  const info = weatherInfo(
    weather.current.code,
    weather.current.isDay
  );

  const today = weather.days[0];

  return (
    <View style={s.card}>
      <Text style={s.label}>
        CURRENT WEATHER
      </Text>

      <View style={s.row}>
        <Text style={s.temperature}>
          {temp(
            weather.current.temperature,
            weather.unit
          )}
        </Text>

        <Ionicons
          name={info.icon}
          color="#F6BC55"
          size={76}
        />
      </View>

      <Text style={s.condition}>
        {info.label}
      </Text>

      <Text style={s.sub}>
        Feels like{' '}
        {temp(
          weather.current.feelsLike,
          weather.unit,
          true
        )}
      </Text>

      <Text style={s.sub}>
        High {temp(today?.high, weather.unit)}
        {' / '}
        Low {temp(today?.low, weather.unit)}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 24,
    backgroundColor: colors.primary,
    gap: 10,
  },

  label: {
    color: colors.onDark,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },

  temperature: {
    fontSize: 72,
    fontWeight: '800',
    color: colors.white,
  },

  condition: {
    fontSize: 23,
    fontWeight: '700',
    color: colors.white,
  },

  sub: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.onDark,
  },
});