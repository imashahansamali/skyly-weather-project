import {
  Linking,
  Text,
  View,
} from 'react-native';

import type { Weather } from '../types/weather';

import WeatherCard from './WeatherCard';
import DetailCard from './DetailCard';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';

import {
  Button,
  Card,
  SectionTitle,
  styles,
} from './UI';

import {
  localClock,
  numberLabel,
} from '../utils/formatters';

export default function WeatherContent({
  weather,
  onForecast,
  onRefresh,
}: {
  weather: Weather;
  onForecast: () => void;
  onRefresh: () => void;
}) {
  const today = weather.days[0];

  return (
    <>
      <WeatherCard weather={weather} />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <DetailCard
          label="Humidity"
          value={numberLabel(
            weather.current.humidity,
            '%'
          )}
          icon="water-outline"
        />

        <DetailCard
          label="Wind"
          value={numberLabel(
            weather.current.wind,
            ' km/h'
          )}
          icon="flag-outline"
        />

        <DetailCard
          label="Rain chance"
          value={numberLabel(
            weather.current.rainChance,
            '%'
          )}
          icon="umbrella-outline"
        />
      </View>

      <SectionTitle
        title="Today, hour by hour"
      />

      <HourlyForecast
        hours={weather.hours}
        unit={weather.unit}
      />

      <SectionTitle
        title="Next 5 days"
        action="View all"
        onPress={onForecast}
      />

      <DailyForecast
        days={weather.days.slice(1, 6)}
        unit={weather.unit}
      />

      {today ? (
        <Card>
          <SectionTitle
            title="Sunrise & sunset"
          />

          <Text style={styles.body}>
            Sunrise {localClock(today.sunrise)}
            {' · '}
            Sunset {localClock(today.sunset)}
          </Text>
        </Card>
      ) : null}

      <Text style={styles.body}>
        Local weather time:{' '}
        {localClock(weather.localTime)}
        {'\n'}
        {weather.timezone}
      </Text>

      <Button
        title="Refresh weather"
        secondary
        onPress={onRefresh}
      />

      <Text
        accessibilityRole="link"
        onPress={() => {
          void Linking.openURL(
            'https://open-meteo.com/'
          ).catch(() => {});
        }}
        style={[
          styles.link,
          { textAlign: 'center' },
        ]}
      >
        Weather data by Open-Meteo · CC BY 4.0
      </Text>
    </>
  );
}