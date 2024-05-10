import { useQuery } from "@apollo/client";
import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { SectionList, View } from "react-native";
import { Icon, List, Surface, useTheme } from "react-native-paper";
import {
  GetNewsletterEmailsQuery,
  GetSubscriptionsQuery,
} from "../../../__generated__/graphql";
import {
  GET_NEWSLETTER_EMAIL,
  GET_SUBS,
  NewsletterEmailItem,
  SubscriptionItem,
} from "../../../graphql/graphql";

export default function Page() {
  const theme = useTheme();
  const { data } = useQuery<GetNewsletterEmailsQuery>(GET_NEWSLETTER_EMAIL);
  const { data: subsData } = useQuery<GetSubscriptionsQuery>(GET_SUBS);

  const renderItem = ({
    item,
  }: {
    item: SubscriptionItem | NewsletterEmailItem;
  }) => {
    if (item.__typename === "Subscription") {
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
    }

    return (
      <List.Item
        style={{ paddingHorizontal: 16 }}
        title={item.address}
        titleNumberOfLines={2}
        onPress={() => {
          Clipboard.setStringAsync(item.address);
        }}
        right={() => <Icon source={"content-copy"} size={24} />}
      />
    );
  };

  const sectionData = [
    {
      title: "Emails",
      showAdd: true,
      data:
        data?.newsletterEmails?.__typename === "NewsletterEmailsSuccess"
          ? data?.newsletterEmails?.newsletterEmails
          : [],
    },
    {
      title: "Newsletters",
      showAdd: false,
      data:
        subsData?.subscriptions?.__typename === "SubscriptionsSuccess"
          ? subsData?.subscriptions?.subscriptions.filter(
              (s) => s.type === "NEWSLETTER"
            )
          : [],
    },
  ];

  const renderSectionHeader = ({ section: { title, showAdd } }) => {
    return (
      <View>
        {showAdd && (
          <List.Item
            style={{ paddingHorizontal: 16 }}
            title="Add new email address"
            titleStyle={{ color: theme.colors.primary }}
            left={(props) => (
              <List.Icon color={theme.colors.primary} icon="plus" />
            )}
          />
        )}

        <List.Subheader>{title}</List.Subheader>
      </View>
    );
  };

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen options={{ title: "Newsletters" }} />

      <SectionList
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 42,
        }}
        sections={sectionData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </Surface>
  );
}
