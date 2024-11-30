import ExpoImage from "expo-image/build/ExpoImage";
import * as WebBrowser from "expo-web-browser";
import React, { memo, useCallback } from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import {
  ArticleFieldsFragment,
  LabelFieldsFragment,
} from "../../__generated__/graphql";
import useMarkdownStyles from "../../utils/useMarkdownStyles";
import ArticleFooter from "./ArticleFooter";
import ArticleHeader from "./ArticleHeader";

type Props = {
  onScroll: (nativeEvent: { nativeEvent: any }) => void;
  article: ArticleFieldsFragment & { content: string } & {
    labels: LabelFieldsFragment[];
  };
  onShare: () => void;
  onArchive: () => void;
};

const renderRules = {
  image: (
    node,
    children,
    parent,
    styles,
    allowedImageHandlers,
    defaultImageHandler
  ) => {
    const { src, alt } = node.attributes;

    // we check that the source starts with at least one of the elements in allowedImageHandlers
    const show =
      allowedImageHandlers.filter((value) => {
        return src.toLowerCase().startsWith(value.toLowerCase());
      }).length > 0;

    if (show === false && defaultImageHandler === null) {
      return null;
    }

    const imageProps = {
      indicator: true,
      key: node.key,
      style: styles._VIEW_SAFE_image,
      source: src,
    };

    if (alt) {
      imageProps.accessible = true;
      imageProps.accessibilityLabel = alt;
    }

    return <ExpoImage {...imageProps} />;
  },
};

const ArticleContent = ({ articleId, articleContent }) => {
  console.log("render", "article");
  const { styles } = useMarkdownStyles();
  const handleLinkPress = useCallback((url: string) => {
    WebBrowser.openBrowserAsync(url);
    return true;
  }, []);

  return (
    <Markdown style={styles} onLinkPress={handleLinkPress}>
      {articleContent}
    </Markdown>
  );
};

const arePropsEqual = (oldProps, newProps) =>
  oldProps.articleId === newProps.articleId;

const MemoArticleContent = memo(ArticleContent, arePropsEqual);

const Article = ({ onScroll, onShare, onArchive, article }: Props) => {
  console.log("render");
  return (
    <ScrollView
      scrollEventThrottle={60}
      contentContainerStyle={{ padding: 16 }}
      contentInsetAdjustmentBehavior="automatic"
      style={{ height: "100%" }}
    >
      <ArticleHeader article={article} />
      <MemoArticleContent
        articleId={article.id}
        articleContent={article.content}
      />
      <ArticleFooter onShare={onShare} onArchive={onArchive} />
    </ScrollView>
  );
};

export default memo(Article);
