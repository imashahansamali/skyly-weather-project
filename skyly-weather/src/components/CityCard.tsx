import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type { City } from '../types/weather';
import { colors } from '../theme/colors';

export default function CityCard({
  city,
  onPress,
  onRemove,
}: {
  city: City;
  onPress: () => void;
  onRemove?: () => void;
}) {
  return (
    <View style={s.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          `View weather in ${city.name}`
        }
        onPress={onPress}
        style={s.main}
      >
        <Ionicons
          name="location-outline"
          size={23}
          color={colors.accent}
        />

        <View style={s.text}>
          <Text style={s.title}>
            {city.name}
          </Text>

          <Text style={s.subtitle}>
            {[city.region, city.country]
              .filter(Boolean)
              .join(' · ')}
          </Text>

          <Text style={s.link}>
            View weather →
          </Text>
        </View>
      </Pressable>

      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            `Remove ${city.name}`
          }
          onPress={onRemove}
          style={s.remove}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={colors.danger}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
    minHeight: 90,
  },

  text: {
    flex: 1,
    gap: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  link: {
    fontSize: 13,
    color: colors.accent,
  },

  remove: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
});