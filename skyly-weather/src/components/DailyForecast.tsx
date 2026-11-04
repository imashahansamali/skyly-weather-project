import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type {
  DayForecast,
  TemperatureUnit,
} from '../types/weather';

import {
  localDate,
  numberLabel,
  temp,
} from '../utils/formatters';

import { weatherInfo } from '../utils/weatherCodes';
import { Card } from './UI';
import { colors } from '../theme/colors';

export default function DailyForecast({
  days,
  unit,
}: {
  days: DayForecast[];
  unit: TemperatureUnit;
}) {
  return (
    <Card>
      {days.map((day) => {
        const info = weatherInfo(day.code);

        return (
          <View
            key={day.date}
            style={s.row}
          >
            <View style={s.day}>
              <Text style={s.date}>
                {localDate(day.date, true)}
              </Text>

              <Text style={s.rain}>
                Rain{' '}
                {numberLabel(
                  day.rainChance,
                  '%'
                )}
              </Text>
            </View>

            <Ionicons
              name={info.icon}
              size={26}
              color={info.color}
              accessibilityLabel={info.label}
            />

            <Text style={s.temperature}>
              {temp(day.high, unit)}
              {' / '}
              {temp(day.low, unit)}
            </Text>
          </View>
        );
      })}
    </Card>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 7,
    flexWrap: 'wrap',
  },

  day: {
    flex: 1,
    minWidth: 100,
    gap: 5,
  },

  date: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },

  rain: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  temperature: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '700',
  },
});