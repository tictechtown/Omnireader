import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import {
  SaveArticleReadingProgressMutation,
  SaveArticleReadingProgressMutationVariables,
} from "../__generated__/graphql";
import { SAVE_READING_PROGRESS } from "./graphql";

export default function useSaveReadingProgress() {
  const [saveProgress] = useMutation<
    SaveArticleReadingProgressMutation,
    SaveArticleReadingProgressMutationVariables
  >(SAVE_READING_PROGRESS, {
    update(cache, { data: { saveArticleReadingProgress } }) {
      // Article and SearchItem are not the same type, so we modify the cache!
      if (
        saveArticleReadingProgress.__typename ===
        "SaveArticleReadingProgressSuccess"
      ) {
        const article = saveArticleReadingProgress.updatedArticle;
        const id = `SearchItem:${article.id}`;
        cache.writeFragment({
          id,
          fragment: gql`
            fragment ReadingArticle on SearchItem {
              id
              readingProgressAnchorIndex
              readingProgressPercent
            }
          `,
          data: {
            id,
            readingProgressAnchorIndex: article.readingProgressAnchorIndex,
            readingProgressPercent: article.readingProgressPercent,
          },
        });
      }
    },
  });

  const markAsRead = useCallback(
    (itemId: string) => {
      saveProgress({
        variables: {
          input: {
            id: itemId,
            readingProgressPercent: 100,
            readingProgressTopPercent: 100,
          },
        },
      });
    },
    [saveProgress]
  );

  return [saveProgress, markAsRead];
}
