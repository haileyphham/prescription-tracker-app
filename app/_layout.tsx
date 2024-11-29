import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '@/components/components/UserContext';
import { Tabs } from 'expo-router'; // Import Tabs
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// RootLayout: Global app setup
export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null; // Splash screen is visible until fonts are loaded
    }

    return (
        <UserProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    {/* Stack screen that includes the Tabs */}
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }} // Hide header for Tabs
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ThemeProvider>
        </UserProvider>
    );
}