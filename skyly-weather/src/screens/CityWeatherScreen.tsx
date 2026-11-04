import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { useWeatherData } from '../hooks/useWeatherData';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../types/navigation';

import { useWeather } from '../context/WeatherContext';


import {
  Button,
  Heading,
  Screen,
  styles,
} from '../components/UI';

import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';
import WeatherContent from '../components/WeatherContent';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CityWeather'
>;

export default function CityWeatherScreen({
  route,
  navigation,
}: Props) {
  const { city } = route.params;

  const {
    isSaved,
    saveCity,
    selectCity,
  } = useWeather();

  const {
    data,
    error,
    loading,
    refresh,
  } = useWeatherData(city);

  const [busy, setBusy] = useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  async function save() {
    setBusy(true);

    try {
      await saveCity(city);

      setMessage(
        `${city.name} saved. ` +
        'Find it in Saved Cities.'
      );
    } catch {
      Alert.alert(
        'Unable to save',
        'Your device could not save this city. Please retry.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function useOnDashboard() {
    setBusy(true);

    try {
      await selectCity(city);

      navigation.navigate('Main', {
        screen: 'Weather',
      });
    } catch {
      Alert.alert(
        'Unable to update',
        'Your selected city could not be saved.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading
        title={city.name}
        subtitle={[
          city.region,
          city.country,
        ]
          .filter(Boolean)
          .join(' · ')}
      />

      <Button
        title={
          isSaved(city)
            ? '✓ City saved'
            : 'Save city'
        }
        disabled={busy || isSaved(city)}
        onPress={() => void save()}
      />

      <Button
        title="Use on dashboard"
        secondary
        disabled={busy}
        onPress={() =>
          void useOnDashboard()
        }
      />

      {message ? (
        <Text
          accessibilityLiveRegion="polite"
          style={styles.body}
        >
          {message}
        </Text>
      ) : null}

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView
          message={error}
          onRetry={() => void refresh()}
        />
      ) : data ? (
        <WeatherContent
          weather={data}
          onRefresh={() => void refresh()}
          onForecast={() =>
            navigation.navigate('Forecast', {
              city,
            })
          }
        />
      ) : null}
    </Screen>
  );
}