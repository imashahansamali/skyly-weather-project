import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../types/navigation';

import TabNavigator from './TabNavigator';

import CityWeatherScreen from
  '../screens/CityWeatherScreen';

import ForecastScreen from
  '../screens/ForecastScreen';

import SettingsScreen from
  '../screens/SettingsScreen';

import { colors } from '../theme/colors';

const Stack =
  createNativeStackNavigator<
    RootStackParamList
  >();

export default function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,

        colors: {
          ...DefaultTheme.colors,
          primary: colors.accent,
          background: colors.background,
          card: colors.background,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.primary,

          headerStyle: {
            backgroundColor:
              colors.background,
          },

          contentStyle: {
            backgroundColor:
              colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CityWeather"
          component={CityWeatherScreen}
          options={{
            title: 'City weather',
          }}
        />

        <Stack.Screen
          name="Forecast"
          component={ForecastScreen}
          options={{
            title: 'Forecast',
          }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}