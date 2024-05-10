import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { SearchQuery } from "../__generated__/graphql";
import { ARCHIVE_ARTICLE } from "./graphql";

export default function useArchiveArticle(options = null) {
  const [_setArchiveStatus] = useMutation(ARCHIVE_ARTICLE, {
    update(cache, { data: { setLinkArchived } }) {
      const id = setLinkArchived.linkId;
      console.log("setLinkArchived", setLinkArchived);
      const isArchived = setLinkArchived.message === "link_archived";
      cache.writeFragment({
        id: `Article:${id}`,
        fragment: gql`
          fragment ArchivedArticle on Article {
            id
            isArchived
          }
        `,
        data: {
          id: `Article:${id}`,
          isArchived: isArchived,
        },
      });

      if (isArchived && !!options) {
        const { query, variables } = options;
        cache.updateQuery<SearchQuery>({ query, variables }, (oldData) => {
          if (oldData.search.__typename === "SearchSuccess") {
            const newEdges = oldData.search.edges.filter(
              (e) => e.node.id !== id
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

  const setArchiveStatus = useCallback(
    (articleId: string, isArchived: boolean) => {
      _setArchiveStatus({
        variables: {
          input: {
            linkId: articleId,
            archived: isArchived,
          },
        },
      });
    },
    [_setArchiveStatus]
  );
  return setArchiveStatus;
}
