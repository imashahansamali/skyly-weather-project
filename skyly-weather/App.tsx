import { StatusBar } from 'expo-status-bar';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
  SettingsProvider,
  useSettings,
} from './src/context/SettingsContext';

import {
  WeatherProvider,
  useWeather,
} from './src/context/WeatherContext';

import RootNavigator from
  './src/navigation/RootNavigator';

import LoadingView from
  './src/components/LoadingView';

import {
  Screen,
} from './src/components/UI';

function AppContent() {
  const settings = useSettings();
  const weather = useWeather();

  if (
    !settings.ready ||
    !weather.ready
  ) {
    return (
      <Screen>
        <LoadingView
          message="Starting Skyly…"
        />
      </Screen>
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <WeatherProvider>
          <StatusBar style="dark" />
          <AppContent />
        </WeatherProvider>
      </SettingsProvider>
      
    </SafeAreaProvider>
  );
}