import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { View } from "react-native";
import { Button, Chip, Divider, Text, useTheme } from "react-native-paper";
import {
  ArticleFieldsFragment,
  LabelFieldsFragment,
} from "../../__generated__/graphql";
import formatReadingTime from "../../utils/formatReadingTime";

export default function ArticleHeader({
  article,
}: {
  article: ArticleFieldsFragment & { labels: LabelFieldsFragment[] };
}) {
  const theme = useTheme();
  const { createdAt, title, siteName, originalArticleUrl } = article;
  const handleLinkPress = (url: string) => {
    WebBrowser.openBrowserAsync(url);
    return true;
  };
  const hasSiteIcon = article.siteIcon && !article.siteIcon.endsWith("/128");

  const labels = article.labels.filter((lbl) => !lbl.internal);
  const createdDate = new Date(createdAt).toLocaleDateString(undefined, {
    dateStyle: "long",
  });

  return (
    <View style={{ marginBottom: 16, gap: 8 }}>
      <Text variant="labelMedium">
        {createdDate} • {formatReadingTime(article.wordsCount)} read
      </Text>

      <Text variant="headlineMedium" style={{ lineHeight: 30 }}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        {hasSiteIcon && (
          <Image
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: "white",
            }}
            source={article.siteIcon}
          />
        )}
        <Text
          variant="labelMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {siteName}
        </Text>
        <Button
          mode="text"
          compact
          onPress={() => handleLinkPress(originalArticleUrl)}
        >
          See original Article
        </Button>
      </View>
      {labels.length > 0 && (
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          {labels.map((lbl) => (
            <Chip key={lbl.id} compact mode="outlined">
              {lbl.name}
            </Chip>
          ))}
        </View>
      )}
      <Divider />
    </View>
  );
}
