import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import {
  SearchQuery,
  SetBookmarkArticleMutation,
  SetBookmarkArticleMutationVariables,
} from "../__generated__/graphql";
import { DELETE_ARTICLE } from "./graphql";

export default function useDeleteArticle({ query, variables }) {
  const [_deleteArticle] = useMutation<
    SetBookmarkArticleMutation,
    SetBookmarkArticleMutationVariables
  >(DELETE_ARTICLE, {
    update(cache, { data: { setBookmarkArticle } }) {
      if (setBookmarkArticle.__typename === "SetBookmarkArticleSuccess") {
        // remove entry from the query
        cache.updateQuery<SearchQuery>({ query, variables }, (oldData) => {
          if (oldData.search.__typename === "SearchSuccess") {
            const newEdges = oldData.search.edges.filter(
              (e) => e.node.id !== setBookmarkArticle.bookmarkedArticle.id
            );

            const result = {
              ...oldData,
              search: { ...oldData.search, edges: newEdges },
            };
            return result as SearchQuery;
          }

          return oldData;
        });
      }
    },
  });

  const deleteArticle = useCallback(
    async (articleId: string | null) => {
      if (!articleId) {
        return false;
      }

      try {
        await _deleteArticle({
          variables: {
            input: {
              articleID: articleId,
              bookmark: false,
            },
          },
        });
      } catch (e) {
        console.warn("[Error deleting]", e);
      }
    },
    [_deleteArticle]
  );
  return deleteArticle;
}
