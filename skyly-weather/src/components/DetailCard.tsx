import type { ComponentProps } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={s.card}>
      <Ionicons
        name={icon}
        size={22}
        color={colors.accent}
      />

      <Text style={s.label}>
        {label}
      </Text>

      <Text style={s.value}>
        {value}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 94,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    gap: 9,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  value: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
});