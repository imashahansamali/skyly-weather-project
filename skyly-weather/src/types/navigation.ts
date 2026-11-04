import type {
  NavigatorScreenParams,
} from '@react-navigation/native';

import type { City } from './weather';

export type TabParamList = {
  Weather: undefined;
  Search: undefined;
  Saved: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList> | undefined;
  CityWeather: {
    city: City;
  };
  Forecast: {
    city: City;
  };
  Settings: undefined;
};