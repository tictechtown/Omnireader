import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import {
  SubscribeMutation,
  SubscribeMutationVariables,
  SubscriptionType,
} from "../../__generated__/graphql";
import { ADD_RSS_MUTATION, GET_SUBS } from "../../graphql/graphql";
import getFeedUrl from "../../utils/getFeedUrl";

export default function AddRSSFeedDialog({ visible, onDismiss }) {
  const theme = useTheme();
  const [rssUrl, setRSSUrl] = useState("");
  const [feedError, setFeedError] = useState("");

  const [addSubscription] = useMutation<
    SubscribeMutation,
    SubscribeMutationVariables
  >(ADD_RSS_MUTATION, { refetchQueries: [GET_SUBS] });

  const handleSave = async (url: string) => {
    let result = await addSubscription({
      variables: {
        input: {
          url: url,
          subscriptionType: SubscriptionType.Rss,
        },
      },
    });

    if (
      result.data.subscribe.__typename === "SubscribeError" &&
      result.data.subscribe.errorCodes[0] === "NOT_FOUND"
    ) {
      const newUrl = await getFeedUrl(url);
      console.log("newUrl", newUrl);
      if (newUrl) {
        result = await addSubscription({
          variables: {
            input: {
              url: newUrl.startsWith("/") ? url + newUrl : newUrl,
              subscriptionType: SubscriptionType.Rss,
            },
          },
        });
      }
    }

    if (result.errors) {
      setFeedError(result.errors.toString());
    } else if (result.data.subscribe.__typename === "SubscribeError") {
      if (result.data.subscribe.errorCodes[0] === "NOT_FOUND") {
        setFeedError("RSS Feed not found");
      } else {
        setFeedError(result.data.subscribe.errorCodes.toString());
      }
    } else {
      onDismiss();
    }
  };

  const isActionEnabled = rssUrl.length > 0 && rssUrl.startsWith("http");

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content style={{ gap: 16 }}>
          <Text variant="titleSmall">URL</Text>
          <TextInput
            value={rssUrl}
            autoFocus
            placeholder="https://"
            onChangeText={(txt) => setRSSUrl(txt)}
          />
          <HelperText type="error" visible={feedError.length > 0}>
            {feedError}
          </HelperText>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={theme.colors.onSurfaceVariant}>
            Cancel
          </Button>
          <Button
            onPress={() => handleSave(rssUrl)}
            disabled={!isActionEnabled}
            textColor={theme.colors.primary}
          >
            Add Feed
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
