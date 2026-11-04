import type {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

export function Screen({
  children,
  scroll = true,
}: PropsWithChildren<{
  scroll?: boolean;
}>) {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'left', 'right']}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.page,
            { flex: 1 },
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

export function Heading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.heading}>
      <Text style={styles.eyebrow}>
        SKYLY / WEATHER
      </Text>

      <View style={styles.titleRow}>
        <Text style={styles.title}>
          {title}
        </Text>

        {action}
      </View>

      {subtitle ? (
        <Text style={styles.body}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function Card({
  children,
  style,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  danger = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        danger && {
          backgroundColor: colors.danger,
        },
        (pressed || disabled) && {
          opacity: 0.6,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          secondary && {
            color: colors.primary,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  name,
  label,
  onPress,
}: {
  name: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && { opacity: 0.6 },
      ]}
    >
      <Ionicons
        name={name}
        color={colors.primary}
        size={24}
      />
    </Pressable>
  );
}

export function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {action && onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.link}>
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  page: {
    padding: 24,
    paddingBottom: 36,
    gap: 20,
  },

  heading: {
    gap: 8,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.5,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },

  body: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    gap: 14,
  },

  button: {
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },

  iconButton: {
    minWidth: 48,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
  },

  link: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});