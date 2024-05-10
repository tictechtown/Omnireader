import { useQuery } from "@apollo/client";
import { Link, Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { Avatar, Divider, List, Surface, Text } from "react-native-paper";
import { MeQuery } from "../../../__generated__/graphql";
import { GET_ME } from "../../../graphql/graphql";
import client from "../../../network/apollo";
import { useSettingsStore } from "../../../store";

export default function Page() {
  const { data } = useQuery<MeQuery>(GET_ME);

  const signOut = useSettingsStore((state) => state.clearAuthToken);

  const handleLogout = () => {
    signOut();
    client.clearStore();
  };

  return (
    <Surface
      style={{
        flex: 1,
        minHeight: "100%",
      }}
      mode="flat"
      elevation={0}
    >
      <Stack.Screen options={{ title: "Account" }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <Surface
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 16,
            borderRadius: 8,
          }}
          elevation={2}
          mode="flat"
        >
          {data.me.picture ? (
            <Avatar.Image source={{ uri: data.me.picture }}></Avatar.Image>
          ) : (
            <Avatar.Text label={data.me.name[0].toUpperCase()} />
          )}

          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text variant="titleLarge" style={{ lineHeight: 26 }}>
              {data.me.name}
            </Text>
            <Text variant="titleMedium" style={{ lineHeight: 19 }}>
              @{data.me.profile.username}
            </Text>
          </View>
        </Surface>

        <List.Section>
          <Link href={"/account/labels"}>
            <List.Item
              title="Labels"
              left={(props) => <List.Icon {...props} icon="label-outline" />}
            />
          </Link>
          <Link href={"/account/emails"}>
            <List.Item
              title="Newsletters"
              left={(props) => <List.Icon {...props} icon="email-outline" />}
            />
          </Link>
          <Link href={"/account/feeds"}>
            <List.Item
              title="Feeds"
              left={(props) => <List.Icon {...props} icon="rss" />}
            />
          </Link>
          <Link href={"/account/filters"}>
            <List.Item
              title="Categories"
              left={(props) => <List.Icon {...props} icon="filter-outline" />}
            />
          </Link>
        </List.Section>

        <Divider />
        <List.Section>
          <Link href={"/account/theme"}>
            <List.Item
              title="Theme"
              left={(props) => (
                <List.Icon {...props} icon="white-balance-sunny" />
              )}
            />
          </Link>
          <Link href={"/account/list-style"}>
            <List.Item
              title="List style"
              left={(props) => (
                <List.Icon {...props} icon="view-agenda-outline" />
              )}
            />
          </Link>
        </List.Section>

        <Divider />

        <List.Item
          title="Logout"
          onPress={handleLogout}
          left={(props) => <List.Icon {...props} icon="logout" />}
        />
      </ScrollView>
    </Surface>
  );
}
