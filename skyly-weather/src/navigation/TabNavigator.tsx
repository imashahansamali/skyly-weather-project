import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import type {
  TabParamList,
} from '../types/navigation';

import DashboardScreen from
  '../screens/DashboardScreen';

import SearchScreen from
  '../screens/SearchScreen';

import SavedCitiesScreen from
  '../screens/SavedCitiesScreen';

import { colors } from '../theme/colors';

const Tabs =
  createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          colors.accent,

        tabBarInactiveTintColor:
          colors.textSecondary,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarHideOnKeyboard: true,

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => (
          <Ionicons
            name={
              route.name === 'Weather'
                ? focused
                  ? 'sunny'
                  : 'sunny-outline'
                : route.name === 'Search'
                ? 'search-outline'
                : focused
                ? 'bookmark'
                : 'bookmark-outline'
            }
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="Weather"
        component={DashboardScreen}
      />

      <Tabs.Screen
        name="Search"
        component={SearchScreen}
      />

      <Tabs.Screen
        name="Saved"
        component={SavedCitiesScreen}
        options={{
          title: 'Saved cities',
        }}
      />
    </Tabs.Navigator>
  );
}