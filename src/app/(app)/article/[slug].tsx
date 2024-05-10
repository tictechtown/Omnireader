import { gql, useMutation, useQuery } from "@apollo/client";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Share, View } from "react-native";
import { ActivityIndicator, Appbar, Surface } from "react-native-paper";
import {
  ArticleFieldsFragment,
  GetArticleQuery,
  GetArticleQueryVariables,
  LabelFieldsFragment,
} from "../../../__generated__/graphql";
import DeleteDialog from "../../../components/article/DeleteDialog";
import { HIGHLIGHT_FRAGMENT, LABEL_FRAGMENT } from "../../../graphql/fragments";
import { DELETE_ARTICLE } from "../../../graphql/graphql";
import useArchiveArticle from "../../../graphql/useArchiveArticle";

import debounce from "lodash.debounce";
import ArticleBottomSheet from "../../../components/ArticleBottomSheet";
import EditInfoBottomSheet from "../../../components/EditInfoBottomSheet";
import NotebookBottomSheet from "../../../components/NotebookBottomSheet";
import UpdateLabelDialog from "../../../components/UpdateLabelDialog";
import Article from "../../../components/article/Article";
import useSaveReadingProgress from "../../../graphql/useSaveReadingProgress";

const GET_ME_ARTICLE = gql`
  query GetArticle($slug: String!) {
    article(username: "me", slug: $slug, format: "markdown") {
      ... on ArticleSuccess {
        article {
          ...ArticleFields
          content
          highlights(input: { includeFriends: false }) {
            ...HighlightFields
          }
          labels {
            ...LabelFields
          }
          recommendations {
            ...RecommendationFields
          }
        }
      }
      ... on ArticleError {
        errorCodes
      }
    }
  }

  fragment ArticleFields on Article {
    id
    title
    folder
    url
    author
    image
    savedAt
    createdAt
    publishedAt
    contentReader
    originalArticleUrl
    readingProgressPercent
    readingProgressAnchorIndex
    slug
    isArchived
    description
    linkId
    siteName
    siteIcon
    state
    readAt
    updatedAt
    wordsCount
  }

  ${HIGHLIGHT_FRAGMENT}

  ${LABEL_FRAGMENT}

  fragment RecommendationFields on Recommendation {
    id
    name
    note
    user {
      userId
      name
      username
      profileImageURL
    }
    recommendedAt
  }
`;

const clampToPercent = (float: number) => {
  return Math.floor(Math.max(0, Math.min(100, float)));
};

export default function Page() {
  const { slug } = useLocalSearchParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateLabelDialog, setShowUpdateLabelDialog] = useState(false);
  const [showUpdateInfoDialog, setShowUpdateInfoDialog] = useState(false);

  const { loading, data } = useQuery<GetArticleQuery, GetArticleQueryVariables>(
    GET_ME_ARTICLE,
    {
      variables: {
        slug: slug as string,
      },
    }
  );

  const [saveProgress] = useSaveReadingProgress();
  const [deleteArticle] = useMutation(DELETE_ARTICLE);

  const debouncedSaveProgress = useCallback(debounce(saveProgress, 500), [
    saveProgress,
  ]);
  const setArchiveStatus = useArchiveArticle();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const notebookSheetRef = useRef<BottomSheet>(null);
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleNotebookPress = () => notebookSheetRef.current?.expand();

  const onScroll = ({ nativeEvent }) => {
    const {
      contentInset: { top },
      contentOffset: { y },
      contentSize: { height },
      layoutMeasurement: { height: lHeight },
    } = nativeEvent;

    // height = lHeight + top + y
    const readingProgressPercent = clampToPercent(
      (100 * (lHeight + top + y + 10)) / height
    );
    const readingProgressTopPercent = clampToPercent(
      (100 * (top + y + 10)) / height
    );

    if (data?.article.__typename === "ArticleSuccess") {
      debouncedSaveProgress({
        variables: {
          input: {
            id: data.article.article.id,
            readingProgressPercent,
            readingProgressTopPercent,
          },
        },
      });
    }
  };

  const handleArchive = () => {
    if (data?.article.__typename === "ArticleSuccess") {
      setArchiveStatus(
        data?.article.article.id,
        !data?.article.article.isArchived
      );
    }
  };

  const handleShare = () => {
    if (data?.article.__typename === "ArticleSuccess") {
      Share.share({
        message: data?.article.article.url,
      });
    }
  };

  const article =
    data?.article?.__typename === "ArticleSuccess"
      ? data.article.article
      : undefined;

  return (
    <Surface style={{ flex: 1 }} mode="flat" elevation={0}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: (props) => {
            return (
              <View {...props} style={{ flexDirection: "row" }}>
                <Appbar.Action
                  icon="book-outline"
                  onPress={handleNotebookPress}
                />
                <Appbar.Action
                  icon={
                    data?.article.__typename === "ArticleSuccess" &&
                    data.article.article.isArchived
                      ? "archive"
                      : "archive-outline"
                  }
                  onPress={() => {
                    if (data?.article.__typename === "ArticleSuccess") {
                      setArchiveStatus(
                        data.article.article.id,
                        !data.article.article.isArchived
                      );
                    }
                  }}
                />

                <Appbar.Action
                  icon="delete-outline"
                  onPress={() => {
                    setShowDeleteDialog(true);
                  }}
                />
                <Appbar.Action icon="dots-vertical" onPress={handleOpenPress} />
              </View>
            );
          },
        }}
      />

      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating />
        </View>
      )}

      {data?.article.__typename === "ArticleSuccess" && (
        <Article
          onScroll={onScroll}
          article={
            data?.article.article as ArticleFieldsFragment & {
              content: string;
            } & {
              labels: LabelFieldsFragment[];
            }
          }
          onArchive={handleArchive}
          onShare={handleShare}
        />
      )}
      <DeleteDialog
        visible={showDeleteDialog}
        hideDialog={() => {
          setShowDeleteDialog(false);
        }}
        onDelete={() => {
          setShowDeleteDialog(false);
          if (data?.article.__typename === "ArticleSuccess") {
            deleteArticle({
              variables: {
                input: {
                  articleID: data?.article.article.id,
                  bookmark: false,
                },
              },
            })
              .then((e) => {
                console.log(e);
              })
              .catch((e) => {
                console.log(e);
              });
            router.back();
          }
        }}
      />

      <UpdateLabelDialog
        key={"dia" + article?.id}
        item={
          article as ArticleFieldsFragment & { labels: LabelFieldsFragment[] }
        }
        visible={!!showUpdateLabelDialog}
        onDismiss={() => setShowUpdateLabelDialog(false)}
      />

      <EditInfoBottomSheet
        key={"edt" + article?.id}
        item={article}
        visible={!!showUpdateInfoDialog}
        onDismiss={() => setShowUpdateInfoDialog(false)}
      />

      <ArticleBottomSheet
        key={
          data?.article?.__typename === "ArticleSuccess"
            ? data.article.article.id
            : undefined
        }
        item={
          data?.article.__typename === "ArticleSuccess"
            ? data?.article?.article
            : undefined
        }
        ref={bottomSheetRef}
        onDeletePress={() => {
          setShowDeleteDialog(true);
        }}
        onUpdateLabelPress={() => {
          setShowUpdateLabelDialog(true);
        }}
        onUpdateInfoPress={() => {
          setShowUpdateInfoDialog(true);
        }}
      />

      <NotebookBottomSheet
        key={`nt${
          data?.article?.__typename === "ArticleSuccess"
            ? data.article.article.id
            : undefined
        }`}
        item={
          data?.article.__typename === "ArticleSuccess"
            ? data?.article?.article
            : undefined
        }
        ref={notebookSheetRef}
      />
    </Surface>
  );
}
