import { useMutation, useQuery } from "@apollo/client";
import * as Clipboard from "expo-clipboard";
import * as Crypto from "expo-crypto";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Card,
  HelperText,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import {
  GetNewsletterEmailsQuery,
  SaveUrlMutation,
  SaveUrlMutationVariables,
  SubscribeMutation,
  SubscribeMutationVariables,
  SubscriptionType,
} from "../../__generated__/graphql";
import {
  ADD_RSS_MUTATION,
  ADD_URL_MUTATION,
  GET_NEWSLETTER_EMAIL,
} from "../../graphql/graphql";
import getFeedUrl from "../../utils/getFeedUrl";

export default function Page() {
  const router = useRouter();

  const { loading, data } =
    useQuery<GetNewsletterEmailsQuery>(GET_NEWSLETTER_EMAIL);
  const [feedText, setFeedText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [feedError, setFeedError] = useState("");

  const [addSubscription] = useMutation<
    SubscribeMutation,
    SubscribeMutationVariables
  >(ADD_RSS_MUTATION);

  const [addUrl] = useMutation<SaveUrlMutation, SaveUrlMutationVariables>(
    ADD_URL_MUTATION
  );

  return (
    <>
      <Stack.Screen options={{ title: "Add new Entry" }} />
      <Surface
        mode="flat"
        elevation={0}
        style={{
          flexDirection: "column",
          gap: 16,
          paddingVertical: 32,
          paddingHorizontal: 16,
          flex: 1,
        }}
      >
        <Card mode="contained">
          <Card.Title title="URL" />
          <Card.Content>
            <TextInput
              inputMode="url"
              keyboardType="url"
              label="Url"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              placeholder="https://example.com"
              value={urlText}
              onChangeText={(text) => setUrlText(text)}
            />
          </Card.Content>
          <Card.Actions>
            <Button
              mode="text"
              disabled={feedText.length === 0 || !feedText.startsWith("http")}
              onPress={() => {
                addUrl({
                  variables: {
                    input: {
                      url: feedText,
                      source: "add-link",
                      timezone: "America/New_York", // TODO
                      locale: "en-US",
                      clientRequestId: Crypto.randomUUID(),
                    },
                  },
                }).finally(() => {
                  router.back();
                });
              }}
            >
              Add
            </Button>
          </Card.Actions>
        </Card>
        <Card mode="contained">
          <Card.Title title="RSS Feed" />
          <Card.Content>
            <TextInput
              inputMode="url"
              keyboardType="url"
              label="Feed"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              placeholder="https://example.com/feed"
              value={feedText}
              onChangeText={(text) => setFeedText(text)}
            />
            <HelperText type="error" visible={feedError.length > 0}>
              {feedError}
            </HelperText>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="text"
              disabled={feedText.length === 0 || !feedText.startsWith("http")}
              onPress={async () => {
                let result = await addSubscription({
                  variables: {
                    input: {
                      url: feedText,
                      subscriptionType: SubscriptionType.Rss,
                    },
                  },
                });

                if (
                  result.data.subscribe.__typename === "SubscribeError" &&
                  result.data.subscribe.errorCodes[0] === "NOT_FOUND"
                ) {
                  const newUrl = await getFeedUrl(feedText);
                  console.log("newUrl", newUrl);
                  if (newUrl) {
                    result = await addSubscription({
                      variables: {
                        input: {
                          url: newUrl.startsWith("/")
                            ? feedText + newUrl
                            : newUrl,
                          subscriptionType: SubscriptionType.Rss,
                        },
                      },
                    });
                  }
                }

                if (result.errors) {
                  setFeedError(result.errors.toString());
                } else if (
                  result.data.subscribe.__typename === "SubscribeError"
                ) {
                  if (result.data.subscribe.errorCodes[0] === "NOT_FOUND") {
                    setFeedError("RSS Feed not found");
                  } else {
                    setFeedError(result.data.subscribe.errorCodes.toString());
                  }
                } else {
                  router.back();
                }
              }}
            >
              Add
            </Button>
          </Card.Actions>
        </Card>
        <Card mode="contained">
          <Card.Title title="Email Newsletter" />
          <Card.Content>
            {loading && <ActivityIndicator animating />}
            {data?.newsletterEmails.__typename ===
              "NewsletterEmailsSuccess" && (
              <Text variant="bodyMedium">
                {data?.newsletterEmails.newsletterEmails[0].address}
              </Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="text"
              disabled={
                data?.newsletterEmails.__typename === "NewsletterEmailsError"
              }
              onPress={() => {
                data?.newsletterEmails.__typename ===
                  "NewsletterEmailsSuccess" &&
                  Clipboard.setStringAsync(
                    data?.newsletterEmails.newsletterEmails[0].address
                  );
              }}
            >
              Copy Email
            </Button>
          </Card.Actions>
        </Card>
      </Surface>
    </>
  );
}
