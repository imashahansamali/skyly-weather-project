import { useWeatherData } from '../hooks/useWeatherData';
import type {
  CompositeScreenProps,
} from '@react-navigation/native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
  TabParamList,
} from '../types/navigation';

import { useWeather } from '../context/WeatherContext';

import { localDate } from '../utils/formatters';

import {
  Heading,
  IconButton,
  Screen,
} from '../components/UI';

import WeatherContent from
  '../components/WeatherContent';

import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';

type Props = CompositeScreenProps<
  BottomTabScreenProps<
    TabParamList,
    'Weather'
  >,
  NativeStackScreenProps<RootStackParamList>
>;

export default function DashboardScreen({
  navigation,
}: Props) {
  const {
    selectedCity,
    storageError,
    dismissStorageError,
  } = useWeather();

  const {
    data,
    error,
    loading,
    refresh,
  } = useWeatherData(selectedCity);

  return (
    <Screen>
      <Heading
        title={selectedCity.name}
        subtitle={
          data
            ? `${selectedCity.country} · ` +
              localDate(data.localTime)
            : selectedCity.country
        }
        action={
          <IconButton
            name="settings-outline"
            label="Open settings"
            onPress={() =>
              navigation.navigate('Settings')
            }
          />
        }
      />

      {storageError ? (
        <ErrorView
          message={storageError}
          onRetry={dismissStorageError}
        />
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
              city: selectedCity,
            })
          }
        />
      ) : null}
    </Screen>
  );
}