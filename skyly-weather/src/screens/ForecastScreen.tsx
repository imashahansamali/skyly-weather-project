import { Text } from 'react-native';
import { useWeatherData } from '../hooks/useWeatherData';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../types/navigation';



import {
  Button,
  Heading,
  Screen,
  styles,
} from '../components/UI';

import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import DailyForecast from '../components/DailyForecast';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Forecast'
>;

export default function ForecastScreen({
  route,
}: Props) {
  const {
    data,
    error,
    loading,
    refresh,
  } = useWeatherData(route.params.city);

  return (
    <Screen>
      <Heading
        title="5-day forecast"
        subtitle={route.params.city.name}
      />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView
          message={error}
          onRetry={() => void refresh()}
        />
      ) : data ? (
        <>
          <Text style={styles.body}>
            The next five days after today.
            Dates follow the selected city's
            timezone.
          </Text>

          <DailyForecast
            days={data.days.slice(1, 6)}
            unit={data.unit}
          />

          <Text style={styles.body}>
            Timezone: {data.timezone}
          </Text>

          <Button
            title="Refresh forecast"
            secondary
            onPress={() => void refresh()}
          />
        </>
      ) : null}
    </Screen>
  );
}