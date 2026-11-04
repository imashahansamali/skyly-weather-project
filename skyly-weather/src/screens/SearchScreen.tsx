import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

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

import {
  POPULAR_CITIES,
  type City,
} from '../types/weather';

import {
  searchCities,
} from '../services/weatherService';

import {
  getCurrentCity,
} from '../services/locationService';

import {
  Button,
  Heading,
  Screen,
  SectionTitle,
} from '../components/UI';

import CityCard from '../components/CityCard';
import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';

import { colors } from '../theme/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<
    TabParamList,
    'Search'
  >,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SearchScreen({
  navigation,
}: Props) {
  const [query, setQuery] = useState('');

  const [results, setResults] =
    useState<City[]>([]);

  const [submitted, setSubmitted] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [locating, setLocating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const controller =
    useRef<AbortController | null>(null);

  const sequence = useRef(0);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;

    return () => {
      active.current = false;
      sequence.current++;
      controller.current?.abort();
    };
  }, []);

  function updateQuery(value: string) {
    controller.current?.abort();
    sequence.current++;

    setQuery(value);
    setLoading(false);
    setResults([]);
    setSubmitted('');
    setError(null);
  }

  async function search() {
    const term = query.trim();

    if (term.length < 2) {
      return;
    }

    Keyboard.dismiss();
    controller.current?.abort();

    const abort = new AbortController();
    controller.current = abort;

    const id = ++sequence.current;

    setLoading(true);
    setError(null);
    setSubmitted(term);
    setResults([]);

    try {
      const cities = await searchCities(
        term,
        abort.signal
      );

      if (
        active.current &&
        sequence.current === id
      ) {
        setResults(cities);
      }
    } catch (e) {
      if (
        active.current &&
        sequence.current === id &&
        !abort.signal.aborted
      ) {
        setError(
          e instanceof Error
            ? e.message
            : 'Search failed.'
        );
      }
    } finally {
      if (
        active.current &&
        sequence.current === id
      ) {
        setLoading(false);
      }
    }
  }

  async function locate() {
    setLocating(true);
    setError(null);

    try {
      const city = await getCurrentCity();

      if (active.current) {
        navigation.navigate(
          'CityWeather',
          { city }
        );
      }
    } catch (e) {
      if (active.current) {
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to locate you. Search manually.'
        );
      }
    } finally {
      if (active.current) {
        setLocating(false);
      }
    }
  }

  return (
    <Screen>
      <Heading
        title="Find your city"
        subtitle={
          'Search anywhere, or check ' +
          'the weather near you.'
        }
      />

      <View style={s.inputRow}>
        <Ionicons
          name="search-outline"
          size={22}
          color={colors.textSecondary}
        />

        <TextInput
          accessibilityLabel={
            'Search city or location'
          }
          style={s.input}
          placeholder="Search city or location"
          placeholderTextColor={
            colors.textSecondary
          }
          value={query}
          onChangeText={updateQuery}
          onSubmitEditing={() => void search()}
          returnKeyType="search"
          autoCorrect={false}
          maxLength={100}
        />

        {query ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => updateQuery('')}
            hitSlop={10}
          >
            <Ionicons
              name="close-circle"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>

      <Button
        title="Search cities"
        disabled={
          query.trim().length < 2 ||
          loading ||
          locating
        }
        onPress={() => void search()}
      />

      <Button
        secondary
        title={
          locating
            ? 'Finding your location…'
            : 'Use my current location'
        }
        disabled={locating || loading}
        onPress={() => void locate()}
      />

      {loading ? (
        <LoadingView
          message="Searching cities…"
        />
      ) : null}

      {locating ? (
        <LoadingView
          message={
            'Please allow location access ' +
            'if prompted.'
          }
        />
      ) : null}

      {error ? (
        <ErrorView
          message={error}
          onRetry={
            submitted
              ? () => void search()
              : undefined
          }
        />
      ) : null}

      {!loading &&
      !error &&
      submitted &&
      results.length === 0 ? (
        <EmptyState
          title="No city found"
          message={
            `No results for “${submitted}”. ` +
            'Check the spelling or try a nearby city.'
          }
        />
      ) : null}

      {!loading && results.length > 0 ? (
        <SectionTitle
          title={`Results for “${submitted}”`}
        />
      ) : null}

      {results.map((city) => (
        <CityCard
          key={city.id}
          city={city}
          onPress={() =>
            navigation.navigate(
              'CityWeather',
              { city }
            )
          }
        />
      ))}

      {!submitted && !loading ? (
        <>
          <SectionTitle
            title="Popular in Sri Lanka"
          />

          {POPULAR_CITIES.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onPress={() =>
                navigation.navigate(
                  'CityWeather',
                  { city }
                )
              }
            />
          ))}
        </>
      ) : null}

      <Text style={s.note}>
        Enter at least two characters.
        Select the correct region and country
        when names match.
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  inputRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
    gap: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
  },

  note: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },
});