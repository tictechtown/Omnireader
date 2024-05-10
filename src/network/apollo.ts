import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getStoredAPIToken } from "../store";

type SearchResult = {
  edges: SearchEdge[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    totalCount: number;
    __typename: "PageInfo";
  };
};

type SearchEdge = {
  __typename: string;
  cursor: string;
  node: { __ref: string };
};

const httpLink = createHttpLink({
  uri: "https://api-prod.omnivore.app/api/graphql",
});

const authLink = setContext(async () => {
  const apiToken = await getStoredAPIToken();
  return {
    headers: {
      authorization: apiToken ?? process.env.EXPO_PUBLIC_API_KEY,
    },
  };
});

// TODO
// const resetToken = onError(({ networkError }) => {
//   if (
//     networkError &&
//     networkError.name === "ServerError" &&
//     networkError.statusCode === 401
//   ) {
//     // remove cached token on 401 from the server
//     // TODO
//   }
// });

const client = new ApolloClient({
  link: authLink.concat(httpLink) /*.concat(resetToken)*/,
  uri: "https://api-prod.omnivore.app/api/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          search: {
            keyArgs: ["query", "markdown"],
            merge(
              existing: SearchResult,
              incoming: SearchResult,
              { args, readField }
            ) {
              const { after } = args;
              const merged = existing
                ? {
                    __typename: "SearchSuccess",
                    edges: [...existing.edges],
                    pageInfo: { ...existing.pageInfo },
                  }
                : {
                    __typename: "SearchSuccess",
                    edges: [],
                    pageInfo: { ...incoming.pageInfo },
                  };
              if (!after) {
                return incoming;
              }
              let offset = offsetFromCursor(merged, after);
              // If we couldn't find the cursor, default to appending to
              // the end of the list, so we don't lose any data.
              if (offset < 0) offset = merged.edges.length;
              // Now that we have a reliable offset, the rest of this logic
              // is the same as in offsetLimitPagination.
              for (let i = 0; i < incoming.edges.length; ++i) {
                merged.edges[offset + i] = incoming.edges[i];
              }
              // we update the pageInfo too
              merged.pageInfo = incoming.pageInfo;
              return merged;
            },
          },
        },
      },
    },
  }),
  // headers: {
  //   authorization:
  //     process.env.EXPO_PUBLIC_API_KEY
  // },
});

function offsetFromCursor(items: SearchResult, cursor) {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.edges.length - 1; i >= 0; --i) {
    const item = items.edges[i];
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (item.cursor === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1;
    }
  }
  // Report that the cursor could not be found.
  return -1;
}

export default client;
