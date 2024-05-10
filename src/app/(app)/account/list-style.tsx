import { Stack } from "expo-router";
import { FlatList, View } from "react-native";
import { Icon, List, Surface, useTheme } from "react-native-paper";
import { ListType, useSettingsStore } from "../../../store";

const DATA: { id: ListType; name: string; icon: string }[] = [
  {
    id: "card",
    name: "Card",
    icon: "view-agenda-outline",
  },

  {
    id: "row",
    name: "Row",
    icon: "format-list-bulleted",
  },
];

export default function Page() {
  const theme = useTheme();
  const { listType, setListType } = useSettingsStore();
  const renderItem = ({ item }: { item: (typeof DATA)[0] }) => {
    return (
      <List.Item
        onPress={() => {
          setListType(item.id);
        }}
        style={{ paddingHorizontal: 16 }}
        title={item.name}
        left={(props) => <Icon size={24} source={item.icon} />}
        right={(props) =>
          item.id === listType && (
            <List.Icon icon={"check"} color={theme.colors.onSurfaceVariant} />
          )
        }
      />
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "List" }} />

      <FlatList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        style={{ height: "100%" }}
        data={DATA}
        ListHeaderComponent={
          <View>
            <List.Subheader>Types</List.Subheader>
          </View>
        }
        renderItem={renderItem}
      />
    </Surface>
  );
}
