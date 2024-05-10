import { ApolloProvider } from "@apollo/client";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useMemo } from "react";
import { View, useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import { ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import client from "../network/apollo";
import { useSettingsStore } from "../store";

function useCombinedTheme(paperTheme: any, colorScheme: string) {
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  if (colorScheme === "dark") {
    return {
      ...DarkTheme,
      ...paperTheme,
      colors: {
        ...DarkTheme.colors,
        ...paperTheme.colors,
      },
    };
  }

  return {
    ...LightTheme,
    ...paperTheme,
    colors: {
      ...LightTheme.colors,
      ...paperTheme.colors,
    },
  };
}

export default function Layout() {
  const colorScheme = useColorScheme();
  const { theme: savedTheme } = useSettingsStore();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#ffd234" });

  const paperTheme = useMemo(() => {
    const chooseDark =
      (savedTheme === "automatic" && colorScheme === "dark") ||
      savedTheme === "dark";

    if (savedTheme === "amoled") {
      const amoledColors = {
        background: "#000",
        surface: "#000",
        surfaceContainerLowest: "#000",
        surfaceContainerLow: "#000",
        surfaceContainer: "#000",
        onSurface: "#fff",
      };

      return { ...MD3DarkTheme, colors: { ...theme.dark, ...amoledColors } };
    }

    return chooseDark
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };
  }, [colorScheme, theme, savedTheme]);

  const combinedTheme = useCombinedTheme(paperTheme, colorScheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <PaperProvider theme={combinedTheme}>
          <ThemeProvider value={combinedTheme}>
            <View
              style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
            >
              <Slot />
            </View>
          </ThemeProvider>
        </PaperProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
