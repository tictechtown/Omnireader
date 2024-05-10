import { Image } from "expo-image";
import { router } from "expo-router";
import { Share, View } from "react-native";
import {
  Chip,
  Icon,
  IconButton,
  MD3Theme,
  Surface,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { SearchQuery } from "../../__generated__/graphql";
import formatReadingTime from "../../utils/formatReadingTime";
import formatRelativeTime from "../../utils/formatRelativeTime";

export type CardItemNode = Extract<
  SearchQuery["search"],
  { __typename?: "SearchSuccess" }
>["edges"][0];

type Props = {
  item: CardItemNode;
  theme: MD3Theme;
  onMorePress: (item: CardItemNode) => void;
};

export default function FeedItem({ item, theme, onMorePress }: Props) {
  const hasImage =
    item.node.image &&
    !(
      item.node.image.endsWith("/jpeg") ||
      item.node.image.endsWith("/webp") ||
      item.node.image.endsWith("/png")
    );

  const userDefinedLabels = item.node.labels.filter(
    (lb) => lb.name !== "RSS" && lb.name !== "Newsletter"
  );

  const isPDF = item.node.pageType === "FILE";
  const isRSS = item.node.labels.find((lb) => lb.name === "RSS");
  const isNewsletter = item.node.labels.find((lb) => lb.name === "Newsletter");

  const supportingText = [
    formatRelativeTime(item.node.createdAt),
    item.node.author,
  ]
    .filter((it) => !!it)
    .join(" • ");

  return (
    <TouchableRipple
      style={{
        backgroundColor: theme.colors.surface,
      }}
      onPress={() => {
        router.push({
          pathname: "/article/[id]",
          params: { id: item.node.slug },
        });
      }}
    >
      <Surface style={{ padding: 16, gap: 8 }} mode="flat" elevation={0}>
        <View
          style={{
            opacity: item.node.readingProgressPercent === 100 ? 0.6 : 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {isPDF && (
                <Icon
                  size={12}
                  source={"file-outline"}
                  color={theme.colors.error}
                />
              )}
              {isRSS && (
                <Icon size={12} source={"rss"} color={theme.colors.primary} />
              )}
              {isNewsletter && (
                <Icon size={12} source={"email"} color={theme.colors.primary} />
              )}
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.primary,
                }}
              >
                {item.node.siteName}
              </Text>{" "}
              • {supportingText}
            </Text>
          </View>
          <Text
            variant="titleMedium"
            style={{ lineHeight: 19, marginVertical: 4 }}
          >
            {item.node.title}
          </Text>
        </View>

        {!!userDefinedLabels.length && (
          <View style={{ flexDirection: "row", gap: 4 }}>
            {userDefinedLabels.map((label) => (
              <View key={label.name}>
                <Chip mode="outlined" compact>
                  {label.name}
                </Chip>
              </View>
            ))}
          </View>
        )}

        {hasImage && (
          <Image
            style={{
              width: "100%",
              minHeight: 20,
              aspectRatio: 2,
              borderRadius: 24,
            }}
            contentFit="cover"
            source={item.node.image}
          />
        )}

        {!!item.node.description && (
          <Surface
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              opacity: item.node.readingProgressPercent === 100 ? 0.6 : 1,
            }}
            elevation={2}
            mode="flat"
          >
            <Text numberOfLines={2}>{item.node.description}</Text>
          </Surface>
        )}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", flex: 0, gap: 8 }}>
            <View>
              <Chip compact>{formatReadingTime(item.node.wordsCount)}</Chip>
            </View>
            <View>
              <Chip
                style={{
                  backgroundColor:
                    item.node.readingProgressPercent === 100
                      ? theme.colors.primaryContainer
                      : theme.colors.elevation.level3,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/article/[id]",
                    params: { id: item.node.slug },
                  })
                }
                compact
                elevated
              >
                {parseFloat(item.node.readingProgressPercent.toFixed(0))}%
              </Chip>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon="share-variant"
              size={20}
              onPress={() => {
                Share.share({
                  message: item.node.url,
                });
              }}
            />
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={() => onMorePress(item)}
            />
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );
}
