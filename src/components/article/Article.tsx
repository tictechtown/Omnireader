import * as WebBrowser from "expo-web-browser";
import React, { memo, useCallback } from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import Pdf from "react-native-pdf";
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

const Article = ({ onScroll, onShare, onArchive, article }: Props) => {
  const { styles } = useMarkdownStyles();

  const handleLinkPress = useCallback((url: string) => {
    WebBrowser.openBrowserAsync(url);
    return true;
  }, []);

  if (article.contentReader === "PDF") {
    return (
      <Pdf
        source={{ uri: article.url, cache: false }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{ flex: 1 }}
        trustAllCerts={false}
      />
    );
  }

  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{ padding: 16 }}
      contentInsetAdjustmentBehavior="automatic"
      style={{ height: "100%" }}
    >
      <ArticleHeader article={article} />
      <Markdown style={styles} onLinkPress={handleLinkPress}>
        {article.content}
      </Markdown>
      <ArticleFooter onShare={onShare} onArchive={onArchive} />
    </ScrollView>
  );
};

export default memo(Article);
