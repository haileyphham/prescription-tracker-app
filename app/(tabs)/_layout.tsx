import React from 'react';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Assuming you have a custom TabBarIcon component
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook to get the current color scheme

export default function TabLayout() {
  const colorScheme = useColorScheme(); // Get the current color scheme

  // Manually define colors for active and inactive states
  const activeColorLight = '#0056b3';  // Dark blue for active tab (light mode)
  const inactiveColorLight = '#A0B1D8'; // Lighter blue for inactive tab (light mode)

  const activeColorDark = '#0066cc';   // Dark blue for active tab (dark mode)
  const inactiveColorDark = '#888888'; // Grey for inactive tab (dark mode)

  // Determine the active and inactive color based on the theme
  const activeColor = colorScheme === 'dark' ? activeColorDark : activeColorLight;
  const inactiveColor = colorScheme === 'dark' ? inactiveColorDark : inactiveColorLight;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor, // Active tab color
        tabBarInactiveTintColor: inactiveColor, // Inactive tab color
        headerShown: false, // Disable header for tab screens
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={focused ? activeColor : inactiveColor} // Set color based on focused state
            />
          ),
        }}
      />

      {/* Calendar tab */}
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              color={focused ? activeColor : inactiveColor} // Set color based on focused state
            />
          ),
        }}
      />

      {/* Add Medication tab */}
      <Tabs.Screen
        name="AddMedicationScreen"
        options={{
          title: 'Add Medication',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'add-circle' : 'add-circle-outline'}
              color={focused ? activeColor : inactiveColor} // Set color based on focused state
            />
          ),
        }}
      />
    </Tabs>
  );
}
