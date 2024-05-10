import { Stack } from "expo-router";
import { FlatList, View } from "react-native";
import { Icon, List, Surface, useTheme } from "react-native-paper";
import { Theme, useSettingsStore } from "../../../store";

const DATA = [
  {
    id: "automatic",
    name: "Automatic",
    icon: "brightness-6",
  },

  {
    id: "light",
    name: "Light",
    icon: "brightness-5",
  },
  {
    id: "dark",
    name: "Dark",
    icon: "brightness-2",
  },
  {
    id: "amoled",
    name: "AMOLED",
    icon: "brightness-1",
  },
];

export default function Page() {
  const theme = useTheme();
  const { theme: savedTheme, setTheme } = useSettingsStore();
  const renderItem = ({ item }: { item: (typeof DATA)[0] }) => {
    return (
      <List.Item
        onPress={() => {
          setTheme(item.id as Theme);
        }}
        style={{ paddingHorizontal: 16 }}
        title={item.name}
        left={(props) => <Icon size={24} source={item.icon} />}
        right={(props) =>
          item.id === savedTheme && (
            <List.Icon icon={"check"} color={theme.colors.onSurfaceVariant} />
          )
        }
      />
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "Theme" }} />

      <FlatList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        style={{ height: "100%" }}
        data={DATA}
        ListHeaderComponent={
          <View>
            <List.Subheader>Themes</List.Subheader>
          </View>
        }
        renderItem={renderItem}
      />
    </Surface>
  );
}
