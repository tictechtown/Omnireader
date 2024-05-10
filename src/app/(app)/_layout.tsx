import { Redirect, Stack } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useHydration, useSettingsStore } from "../../store";

export default function AppLayout() {
  const theme = useTheme();
  const authToken = useSettingsStore((st) => st.authToken);

  const storeIsReady = useHydration();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (!storeIsReady) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator animating />
        </View>
      </SafeAreaView>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!authToken) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.elevation.level1,
        },
        headerTintColor: theme.colors.onSurface,

        navigationBarColor: "transparent",
      }}
    />
  );
}
