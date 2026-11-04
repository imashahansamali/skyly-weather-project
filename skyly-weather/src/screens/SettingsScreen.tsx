import { useState } from 'react';


import {
  Alert,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../types/navigation';

import type {
  TemperatureUnit,
} from '../types/weather';

import { useSettings } from '../context/SettingsContext';
import { useWeather } from '../context/WeatherContext';

import {
  getCurrentCity,
} from '../services/locationService';

import {
  Button,
  Card,
  Heading,
  Screen,
  styles,
} from '../components/UI';

import { colors } from '../theme/colors';
import ErrorView from '../components/ErrorView';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;

export default function SettingsScreen({
  navigation,
}: Props) {
  const {
    unit,
    changeUnit,
    error,
    dismissError,
  } = useSettings();

  const { selectCity } = useWeather();

  const [busy, setBusy] =
    useState(false);

  async function choose(
    value: TemperatureUnit
  ) {
    setBusy(true);

    try {
      await changeUnit(value);
    } catch {
      Alert.alert(
        'Unable to save settings',
        'Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function locate() {
    setBusy(true);

    try {
      const city = await getCurrentCity();

      await selectCity(city);

      navigation.navigate('Main', {
        screen: 'Weather',
      });
    } catch (e) {
      Alert.alert(
        'Location unavailable',
        e instanceof Error
          ? e.message
          : 'Search for a city manually.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading
        title="Settings"
        subtitle="Personalise your weather view."
      />

      {error ? (
        <ErrorView
          message={error}
          onRetry={dismissError}
        />
      ) : null}

      <Card>
        <Text style={styles.sectionTitle}>
          Temperature unit
        </Text>

        {(
          ['celsius', 'fahrenheit'] as const
        ).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{
              checked: unit === value,
              disabled: busy,
            }}
            disabled={busy}
            onPress={() =>
              void choose(value)
            }
            style={{
              padding: 16,
              minHeight: 52,
              borderWidth: 1,
              borderRadius: 12,
              borderColor:
                unit === value
                  ? colors.accent
                  : colors.border,
              backgroundColor:
                unit === value
                  ? colors.pale
                  : colors.surface,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
              }}
            >
              {unit === value ? '●' : '○'}
              {'  '}
              {value === 'celsius'
                ? 'Celsius (°C)'
                : 'Fahrenheit (°F)'}
            </Text>
          </Pressable>
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>
          Location
        </Text>

        <Text style={styles.body}>
          Location is optional. We request
          foreground access only when you
          choose to use it. Coordinates are
          sent to the weather provider to
          retrieve your forecast.
        </Text>

        <Button
          title={
            busy
              ? 'Please wait…'
              : 'Use current location'
          }
          disabled={busy}
          onPress={() => void locate()}
        />

        <Button
          secondary
          title="Open device settings"
          onPress={() => {
            void Linking.openSettings().catch(
              () => {
                Alert.alert(
                  'Settings unavailable',
                  'Open phone settings manually.'
                );
              }
            );
          }}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>
          About Skyly
        </Text>

        <Text style={styles.body}>
          A weather dashboard built with
          React Native, TypeScript and Expo.
          Saved cities and preferences are
          stored on this device.
        </Text>

        <Text style={styles.body}>
          Forecasts are model estimates.
          Weather data is provided by
          Open-Meteo.
        </Text>

        <View style={{ gap: 12 }}>
          <Text
            accessibilityRole="link"
            style={styles.link}
            onPress={() => {
              void Linking.openURL(
                'https://open-meteo.com/'
              ).catch(() => {});
            }}
          >
            Open-Meteo · CC BY 4.0
          </Text>

          <Text
            accessibilityRole="link"
            style={styles.link}
            onPress={() => {
              void Linking.openURL(
                'https://www.geonames.org/'
              ).catch(() => {});
            }}
          >
            City data: GeoNames via Open-Meteo
          </Text>
        </View>
      </Card>
    </Screen>
  );
}