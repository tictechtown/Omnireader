import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import FeedList from "../../../components/feed/FeedList";
import { useSettingsStore } from "../../../store";

export default function Page() {
  const theme = useTheme();
  const { slug, name } = useLocalSearchParams(); // state: in:unread in:read in:archive in:inbox
  const { listType, toggleListType } = useSettingsStore();
  const [shouldFilterRead, setShouldFilterRead] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: name as string,
          headerRight: (props) => {
            return (
              <View {...props} style={{ flexDirection: "row" }}>
                <Appbar.Action
                  icon="filter-variant"
                  color={
                    shouldFilterRead
                      ? theme.colors.primary
                      : theme.colors.onSurface
                  }
                  onPress={() => {
                    setShouldFilterRead((prev) => !prev);
                  }}
                />
                <Appbar.Action
                  icon={
                    listType === "card"
                      ? "view-agenda-outline"
                      : "format-list-bulleted"
                  }
                  onPress={() => {
                    toggleListType();
                  }}
                />
              </View>
            );
          },
        }}
      />
      <FeedList
        query={`${slug}`}
        mode={listType}
        shouldFilterRead={shouldFilterRead}
      />
    </>
  );
}
