import React, { useContext } from 'react';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserContext } from '@/components/components/UserContext'; 
import { LoginScreen } from '../LoginScreen';  

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(UserContext);  // Get the user state from context

  // If the user is not logged in, show the login screen
  if (!user) {
    return <LoginScreen />;  
  }


  const activeColorLight = '#0056b3';
  const inactiveColorLight = '#A0B1D8';
  const activeColorDark = '#0066cc';
  const inactiveColorDark = '#888888';

  const activeColor = colorScheme === 'dark' ? activeColorDark : activeColorLight;
  const inactiveColor = colorScheme === 'dark' ? inactiveColorDark : inactiveColorLight;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
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
              color={focused ? activeColor : inactiveColor}
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
              color={focused ? activeColor : inactiveColor}
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
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />

      {/* Data Storage tab */}
      <Tabs.Screen
        name="DataStoreScreen"
        options={{
          title: 'Saved Medications',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'add-circle' : 'add-circle-outline'}
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
    </Tabs>
  );
}
