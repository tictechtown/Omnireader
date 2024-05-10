import { Image } from "expo-image";
import { router } from "expo-router";
import { View } from "react-native";
import {
  Avatar,
  Icon,
  MD3Theme,
  Text,
  TouchableRipple,
} from "react-native-paper";
import formatReadingTime from "../../utils/formatReadingTime";
import formatRelativeTime from "../../utils/formatRelativeTime";
import { CardItemNode } from "./FeedItem";

type Props = {
  item: CardItemNode;
  theme: MD3Theme;
};

export default function FeedListItem({ item, theme }: Props) {
  const hasImage =
    item.node.image &&
    !(
      item.node.image.endsWith("/jpeg") ||
      item.node.image.endsWith("/webp") ||
      item.node.image.endsWith("/png")
    );

  const isPDF = item.node.pageType === "FILE";
  const isRSS = item.node.labels.find((lb) => lb.name === "RSS");
  const isNewsletter = item.node.labels.find((lb) => lb.name === "Newsletter");

  const hasSiteIcon =
    item.node.siteIcon && !item.node.siteIcon.endsWith("/128");

  const description = [
    item.node.siteName ?? item.node.author,
    formatRelativeTime(item.node.savedAt),
  ]
    .filter((it) => !!it)
    .join(" • ");

  return (
    <TouchableRipple
      style={{
        paddingVertical: 4,
        paddingRight: 24,
        backgroundColor: theme.colors.surface,
      }}
      onPress={() => {
        router.push({
          pathname: "/article/[id]",
          params: { id: item.node.slug },
        });
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          marginVertical: 4,
          paddingHorizontal: 16,
          alignItems: "center",
          gap: 16,
        }}
      >
        {hasImage ? (
          <Image
            style={{ width: 36, height: 36, borderRadius: 18 }}
            contentFit="cover"
            source={item.node.image}
          />
        ) : hasSiteIcon ? (
          <Image
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "white",
            }}
            source={item.node.siteIcon}
          />
        ) : (
          <Avatar.Text
            size={36}
            label={(item.node.siteName ??
              item.node.author ??
              item.node.url)[0].toUpperCase()}
          />
        )}

        <View
          style={{
            flex: 1,
            opacity: item.node.readingProgressPercent === 100 ? 0.8 : 1,
          }}
        >
          <Text
            variant="labelMedium"
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
            {description}
          </Text>
          <Text
            variant="titleMedium"
            style={{
              lineHeight: 20,
              color:
                item.node.readingProgressPercent === 100
                  ? theme.colors.onSurfaceVariant
                  : theme.colors.onSurface,
            }}
            numberOfLines={2}
          >
            {item.node.title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 2,
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {formatReadingTime(item.node.wordsCount)} read •{" "}
              {item.node.readingProgressPercent}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}
