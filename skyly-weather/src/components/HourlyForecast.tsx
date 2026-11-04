import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type {
  HourForecast,
  TemperatureUnit,
} from '../types/weather';

import {
  localClock,
  numberLabel,
  temp,
} from '../utils/formatters';

import { weatherInfo } from '../utils/weatherCodes';
import { colors } from '../theme/colors';

export default function HourlyForecast({
  hours,
  unit,
}: {
  hours: HourForecast[];
  unit: TemperatureUnit;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {hours.map((hour, index) => {
        const info = weatherInfo(hour.code);

        return (
          <View
            key={hour.time}
            style={s.hour}
          >
            <Text style={s.time}>
              {index === 0
                ? 'Now'
                : localClock(hour.time)}
            </Text>

            <Ionicons
              name={info.icon}
              color={info.color}
              size={30}
            />

            <Text style={s.temp}>
              {temp(hour.temperature, unit)}
            </Text>

            <Text style={s.rain}>
              {numberLabel(
                hour.rainChance,
                '%'
              )}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: {
    gap: 10,
  },

  hour: {
    minWidth: 78,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },

  time: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  temp: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
  },

  rain: {
    fontSize: 12,
    color: colors.accent,
  },
});