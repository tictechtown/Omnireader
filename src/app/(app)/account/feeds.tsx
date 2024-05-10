import { useQuery } from "@apollo/client";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { List, Surface, useTheme } from "react-native-paper";
import { GetSubscriptionsQuery } from "../../../__generated__/graphql";
import AddRSSFeedDialog from "../../../components/account/AddRSSFeedDialog";
import { GET_SUBS, SubscriptionItem } from "../../../graphql/graphql";

export default function Page() {
  const theme = useTheme();
  const { data } = useQuery<GetSubscriptionsQuery>(GET_SUBS);

  const [showDialog, setShowDialog] = useState(false);

  const feeds =
    data?.subscriptions?.__typename === "SubscriptionsSuccess"
      ? data?.subscriptions?.subscriptions.filter((s) => s.type === "RSS")
      : [];

  const renderItem = ({ item }: { item: SubscriptionItem }) => {
    return (
      <List.Item
        style={{ paddingHorizontal: 16 }}
        title={item.name.trim()}
        description={`Last Received: ${new Date(
          item.updatedAt
        ).toLocaleDateString(undefined, { dateStyle: "medium" })}`}
        right={(props) => <List.Icon icon="dots-vertical" />}
      />
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "Feeds" }} />

      <FlatList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        style={{ height: "100%" }}
        data={feeds}
        ListHeaderComponent={
          <View>
            <List.Item
              style={{ paddingHorizontal: 16 }}
              title="Add a RSS Feed"
              titleStyle={{ color: theme.colors.primary }}
              left={(props) => (
                <List.Icon color={theme.colors.primary} icon="plus" />
              )}
              onPress={() => {
                setShowDialog(true);
              }}
            />

            <List.Subheader>Feeds</List.Subheader>
          </View>
        }
        renderItem={renderItem}
      />
      <AddRSSFeedDialog
        visible={showDialog}
        onDismiss={() => setShowDialog(false)}
      />
    </Surface>
  );
}
