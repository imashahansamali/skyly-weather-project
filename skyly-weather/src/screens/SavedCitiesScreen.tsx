import { Alert } from 'react-native';

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

import type { City } from '../types/weather';
import { useWeather } from '../context/WeatherContext';

import {
  Button,
  Heading,
  Screen,
} from '../components/UI';

import CityCard from '../components/CityCard';
import EmptyState from '../components/EmptyState';

type Props = CompositeScreenProps<
  BottomTabScreenProps<
    TabParamList,
    'Saved'
  >,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SavedCitiesScreen({
  navigation,
}: Props) {
  const {
    savedCities,
    removeCity,
  } = useWeather();

  function confirmRemove(city: City) {
    Alert.alert(
      `Remove ${city.name}?`,
      'You can search for this city and add it again.',
      [
        {
          text: 'Keep city',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            void removeCity(city).catch(() => {
              Alert.alert(
                'Unable to remove',
                'Please try again.'
              );
            });
          },
        },
      ]
    );
  }

  return (
    <Screen>
      <Heading
        title="Saved cities"
        subtitle={
          'Your favourite places, ' +
          'all in one view.'
        }
      />

      {savedCities.length === 0 ? (
        <EmptyState
          title="No saved cities yet"
          message={
            'Find a city and tap Save city. ' +
            'Your places stay here when ' +
            'you reopen the app.'
          }
          button="Find a city"
          onPress={() =>
            navigation.navigate('Search')
          }
        />
      ) : (
        <>
          {savedCities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onPress={() =>
                navigation.navigate(
                  'CityWeather',
                  { city }
                )
              }
              onRemove={() =>
                confirmRemove(city)
              }
            />
          ))}

          <Button
            title="Add another city"
            onPress={() =>
              navigation.navigate('Search')
            }
          />
        </>
      )}
    </Screen>
  );
}