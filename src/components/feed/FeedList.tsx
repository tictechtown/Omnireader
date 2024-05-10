import { useQuery } from "@apollo/client";
import BottomSheet from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import {
  ActivityIndicator,
  Divider,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import {
  SearchItem,
  SearchQuery,
  SearchQueryVariables,
} from "../../__generated__/graphql";
import { GET_FEED_ARTICLES } from "../../graphql/graphql";
import FeedItem, { CardItemNode } from "./FeedItem";

import useArchiveArticle from "../../graphql/useArchiveArticle";
import useDeleteArticle from "../../graphql/useDeleteArticle";
import useAppState from "../../utils/useAppState";
import ArticleBottomSheet from "../ArticleBottomSheet";
import EditInfoBottomSheet from "../EditInfoBottomSheet";
import UpdateLabelDialog from "../UpdateLabelDialog";
import FeedListItem from "./FeedListItem";
import SwipeableItem from "./SwipeableItem";

type Props = {
  query: string;
  mode: "card" | "row";
  shouldFilterRead: boolean;
};

export default function FeedList({
  query,
  mode,
  shouldFilterRead = false,
}: Props) {
  const theme = useTheme();

  const [needQueryRefetch, setNeedQueryRefetch] = useAppState();

  const { loading, error, data, fetchMore, refetch } = useQuery<
    SearchQuery,
    SearchQueryVariables
  >(GET_FEED_ARTICLES, {
    variables: {
      first: 10,
      after: null,
      query: query,
      format: "markdown",
      includeContent: false,
    },
    fetchPolicy: "cache-and-network",
  });

  const refreshData = () => {
    refetch({
      first: 10,
      after: null,
      query: query,
      format: "markdown",
      includeContent: false,
    });
  };

  if (needQueryRefetch) {
    setNeedQueryRefetch(false);
    refreshData();
  }

  const deleteArticle = useDeleteArticle({
    query: GET_FEED_ARTICLES,
    variables: {
      first: 10,
      after: null,
      query: query,
      format: "markdown",
      includeContent: false,
    },
  });
  const archiveArticle = useArchiveArticle({
    query: GET_FEED_ARTICLES,
    variables: {
      first: 10,
      after: null,
      query: query,
      format: "markdown",
      includeContent: false,
    },
  });
  const [showUpdateLabelDialog, setShowUpdateLabelDialog] = useState(false);
  const [showUpdateInfoDialog, setShowUpdateInfoDialog] = useState(false);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!error);
  }, [error]);

  const selectedItemRef = useRef<CardItemNode>(null);
  const articleBottomSheetRef = useRef<BottomSheet>(null);
  const handleOpenPress = (item) => {
    selectedItemRef.current = item;
    articleBottomSheetRef.current?.expand();
  };
  const pageInfo =
    data?.search.__typename === "SearchSuccess"
      ? data?.search?.pageInfo
      : undefined;

  const fetchMoreData = () => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          first: 10,
          after: pageInfo.endCursor,
          query: query,
          format: "markdown",
          includeContent: false,
        },
      });
    }
  };

  const renderCardItem = ({
    item,
  }: {
    item: Extract<
      SearchQuery["search"],
      { __typename?: "SearchSuccess" }
    >["edges"][0];
  }) => {
    return <FeedItem item={item} theme={theme} onMorePress={handleOpenPress} />;
  };

  const renderListItem = ({
    item,
  }: {
    item: Extract<
      SearchQuery["search"],
      { __typename?: "SearchSuccess" }
    >["edges"][0];
  }) => {
    return (
      <SwipeableItem
        onArchivePress={() => {
          archiveArticle(item.node.id, !item.node.isArchived);
        }}
        onDeletePress={() => {
          deleteArticle(item.node.id);
        }}
      >
        <FeedListItem item={item} theme={theme} />
      </SwipeableItem>
    );
  };

  const itemsData = useMemo(() => {
    if (!data) {
      return [];
    }
    if (data.search.__typename === "SearchError") {
      return [];
    }
    const edges = data.search.edges;
    if (shouldFilterRead) {
      return edges.filter((e) => e.node.readingProgressPercent < 100);
    }
    return edges;
  }, [data, shouldFilterRead]);

  if (loading && !data) {
    return (
      <Surface
        mode="flat"
        elevation={0}
        style={{
          flex: 1,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating />
      </Surface>
    );
  }

  if (error && !data) {
    return (
      <Surface style={{ flex: 1, height: "100%" }} mode="flat" elevation={0}>
        <Text>{error.cause?.toString()}</Text>
      </Surface>
    );
  }

  return (
    <Surface style={{ flex: 1, height: "100%" }} mode="flat" elevation={0}>
      <FlatList
        renderItem={mode === "card" ? renderCardItem : renderListItem}
        data={itemsData}
        ItemSeparatorComponent={Divider}
        keyExtractor={(item) => item.node.id}
        onEndReachedThreshold={2}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshData}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
        onEndReached={fetchMoreData}
        contentInset={{ bottom: 42 }}
      />

      <UpdateLabelDialog
        key={"dia" + selectedItemRef.current?.node.id}
        item={selectedItemRef.current?.node as SearchItem}
        visible={!!showUpdateLabelDialog}
        onDismiss={() => setShowUpdateLabelDialog(false)}
      />

      <EditInfoBottomSheet
        key={"edt" + selectedItemRef.current?.node.id}
        item={selectedItemRef.current?.node}
        visible={!!showUpdateInfoDialog}
        onDismiss={() => setShowUpdateInfoDialog(false)}
      />

      <ArticleBottomSheet
        key={"bts" + selectedItemRef.current?.node.id}
        item={selectedItemRef.current?.node}
        ref={articleBottomSheetRef}
        onDeletePress={() => {
          deleteArticle(selectedItemRef.current?.node.id);
        }}
        onUpdateLabelPress={() => {
          setShowUpdateLabelDialog(true);
        }}
        onUpdateInfoPress={() => {
          setShowUpdateInfoDialog(true);
        }}
      />
      <Snackbar
        visible={showError}
        onDismiss={() => {
          setShowError(false);
        }}
        action={{
          label: "Retry",
          onPress: () => {
            setShowError(false);
            refetch();
          },
        }}
      >
        Error fetching data.
      </Snackbar>
    </Surface>
  );
}
