import { useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { GET_ME } from "../graphql/graphql";
import { useSettingsStore } from "../store";

import { router } from "expo-router";

export default function Page() {
  const [apiKey, setApiKey] = useState("");

  const setAuthToken = useSettingsStore((state) => state.setAuthToken);

  const [checkMe, { loading }] = useLazyQuery(GET_ME);

  const handleOnPress = () => {
    setAuthToken(apiKey);
    checkMe()
      .then((data) => {
        router.replace("/");
      })
      .catch((err) => {
        console.log("error calling me");
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Surface
        style={{ flex: 1, paddingHorizontal: 16 }}
        elevation={0}
        mode="flat"
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text variant="headlineLarge">Welcome to Omnireader</Text>
          <Text variant="titleLarge">The mobile client for Omnivore</Text>

          <Text>Go on your Omnivore account and generate an API KEY.</Text>
          <Text>Copy and paste it below to get started.</Text>
        </View>
        <View style={{ marginVertical: 84, gap: 32 }}>
          <TextInput
            placeholder="apiKey"
            mode="outlined"
            value={apiKey}
            onChangeText={setApiKey}
          />
          {loading ? (
            <ActivityIndicator animating />
          ) : (
            <Button mode="contained" onPress={handleOnPress}>
              Log In
            </Button>
          )}
        </View>
      </Surface>
    </SafeAreaView>
  );
}
