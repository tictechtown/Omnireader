import { useQuery } from "@apollo/client";
import { Stack } from "expo-router";
import { FlatList } from "react-native";
import { List, Surface } from "react-native-paper";
import { GetSubscriptionsQuery } from "../../../__generated__/graphql";
import { GET_SUBS, SubscriptionItem } from "../../../graphql/graphql";

export default function Page() {
  const { data } = useQuery<GetSubscriptionsQuery>(GET_SUBS);

  const renderItem = ({ item }: { item: SubscriptionItem }) => {
    return (
      <List.Item
        style={{ paddingHorizontal: 16 }}
        title={item.name.trim()}
        description={`Last Received: ${item.updatedAt}`}
        right={(props) => <List.Icon icon="dots-vertical" />}
      />
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "Subscriptions" }} />

      <FlatList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        style={{ height: "100%" }}
        data={
          data?.subscriptions?.__typename === "SubscriptionsSuccess"
            ? data?.subscriptions?.subscriptions.filter(
                (s) => s.type === "NEWSLETTER"
              )
            : []
        }
        ListHeaderComponent={<List.Subheader>Newsletters</List.Subheader>}
        renderItem={renderItem}
      />
    </Surface>
  );
}
