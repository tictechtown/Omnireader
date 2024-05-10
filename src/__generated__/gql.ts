/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetArticle($slug: String!) {\n    article(username: \"me\", slug: $slug, format: \"markdown\") {\n      ... on ArticleSuccess {\n        article {\n          ...ArticleFields\n          content\n          highlights(input: { includeFriends: false }) {\n            ...HighlightFields\n          }\n          labels {\n            ...LabelFields\n          }\n          recommendations {\n            ...RecommendationFields\n          }\n        }\n      }\n      ... on ArticleError {\n        errorCodes\n      }\n    }\n  }\n\n  fragment ArticleFields on Article {\n    id\n    title\n    folder\n    url\n    author\n    image\n    savedAt\n    createdAt\n    publishedAt\n    contentReader\n    originalArticleUrl\n    readingProgressPercent\n    readingProgressAnchorIndex\n    slug\n    isArchived\n    description\n    linkId\n    siteName\n    siteIcon\n    state\n    readAt\n    updatedAt\n    wordsCount\n  }\n\n  \n\n  \n\n  fragment RecommendationFields on Recommendation {\n    id\n    name\n    note\n    user {\n      userId\n      name\n      username\n      profileImageURL\n    }\n    recommendedAt\n  }\n": types.GetArticleDocument,
    "\n  query TypeaheadSearch($query: String!) {\n    typeaheadSearch(query: $query) {\n      ... on TypeaheadSearchSuccess {\n        items {\n          id\n          title\n          slug\n          siteName\n          contentReader\n        }\n      }\n      ... on TypeaheadSearchError {\n        errorCodes\n      }\n    }\n  }\n": types.TypeaheadSearchDocument,
    "\n  fragment LabelFields on Label {\n    id\n    name\n    color\n    description\n    createdAt\n    internal\n  }\n": types.LabelFieldsFragmentDoc,
    "\n  fragment HighlightFields on Highlight {\n    id\n    type\n    shortId\n    quote\n    prefix\n    suffix\n    patch\n    annotation\n    createdByMe\n    createdAt\n    updatedAt\n    sharedAt\n    highlightPositionPercent\n    highlightPositionAnchorIndex\n    labels {\n      ...LabelFields\n    }\n  }\n\n  \n": types.HighlightFieldsFragmentDoc,
    "\n  query Me {\n    me {\n      id\n      name\n      picture\n      profile {\n        id\n        username\n      }\n    }\n  }\n": types.MeDocument,
    "\n  query GetLabels {\n    labels {\n      ... on LabelsSuccess {\n        labels {\n          ...LabelFields\n        }\n      }\n      ... on LabelsError {\n        errorCodes\n      }\n    }\n  }\n\n  \n": types.GetLabelsDocument,
    "\n  query Search(\n    $after: String\n    $first: Int\n    $query: String\n    $format: String\n    $includeContent: Boolean\n  ) {\n    search(\n      after: $after\n      first: $first\n      query: $query\n      format: $format\n      includeContent: $includeContent\n    ) {\n      ... on SearchSuccess {\n        edges {\n          cursor\n          node {\n            id\n            title\n            slug\n            url\n            pageType\n            contentReader\n            createdAt\n            isArchived\n            archivedAt\n            readingProgressPercent\n            readingProgressTopPercent\n            readingProgressAnchorIndex\n            author\n            image\n            description\n            publishedAt\n            ownedByViewer\n            originalArticleUrl\n            uploadFileId\n            labels {\n              id\n              name\n              color\n            }\n            color\n            pageId\n            shortId\n            quote\n            annotation\n            state\n            siteIcon\n            siteName\n            subscription\n            readAt\n            savedAt\n            wordsCount\n            recommendations {\n              id\n              name\n              note\n              user {\n                userId\n                name\n                username\n                profileImageURL\n              }\n              recommendedAt\n            }\n            highlights {\n              ...HighlightFields\n            }\n            feedContent\n            previewContentType\n            links\n            folder\n            aiSummary\n            directionality\n            format\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n          totalCount\n        }\n      }\n      ... on SearchError {\n        errorCodes\n      }\n    }\n  }\n\n  \n": types.SearchDocument,
    "\n  mutation Subscribe($input: SubscribeInput!) {\n    subscribe(input: $input) {\n      ... on SubscribeSuccess {\n        subscriptions {\n          id\n        }\n      }\n      ... on SubscribeError {\n        errorCodes\n      }\n    }\n  }\n": types.SubscribeDocument,
    "\n  mutation SaveUrl($input: SaveUrlInput!) {\n    saveUrl(input: $input) {\n      ... on SaveSuccess {\n        url\n        clientRequestId\n      }\n      ... on SaveError {\n        errorCodes\n        message\n      }\n    }\n  }\n": types.SaveUrlDocument,
    "\n  query GetNewsletterEmails {\n    newsletterEmails {\n      ... on NewsletterEmailsSuccess {\n        newsletterEmails {\n          id\n          address\n          createdAt\n          subscriptionCount\n        }\n      }\n\n      ... on NewsletterEmailsError {\n        errorCodes\n      }\n    }\n  }\n": types.GetNewsletterEmailsDocument,
    "\n  query GetSubscriptions {\n    subscriptions {\n      ... on SubscriptionsSuccess {\n        subscriptions {\n          id\n          name\n          newsletterEmail\n          url\n          description\n          status\n          unsubscribeMailTo\n          unsubscribeHttpUrl\n          icon\n          type\n          count\n          lastFetchedAt\n          createdAt\n          updatedAt\n          isPrivate\n          autoAddToLibrary\n          fetchContent\n          fetchContentType\n          folder\n          mostRecentItemDate\n          refreshedAt\n          failedAt\n        }\n      }\n      ... on SubscriptionsError {\n        errorCodes\n      }\n    }\n  }\n": types.GetSubscriptionsDocument,
    "\n  query SavedSearches {\n    filters {\n      ... on FiltersSuccess {\n        filters {\n          ...FiltersFragment\n        }\n      }\n      ... on FiltersError {\n        errorCodes\n      }\n    }\n  }\n\n  fragment FiltersFragment on Filter {\n    id\n    name\n    filter\n    position\n    visible\n    defaultFilter\n    folder\n    category\n  }\n": types.SavedSearchesDocument,
    "\n  mutation SaveFilter($input: SaveFilterInput!) {\n    saveFilter(input: $input) {\n      ... on SaveFilterSuccess {\n        filter {\n          id\n          name\n          filter\n          position\n          visible\n          defaultFilter\n          folder\n          category\n        }\n      }\n\n      ... on SaveFilterError {\n        errorCodes\n      }\n    }\n  }\n": types.SaveFilterDocument,
    "\n  mutation DeleteFilter($id: ID!) {\n    deleteFilter(id: $id) {\n      ... on DeleteFilterSuccess {\n        filter {\n          id\n        }\n      }\n      ... on DeleteFilterError {\n        errorCodes\n      }\n    }\n  }\n": types.DeleteFilterDocument,
    "\n  mutation SaveArticleReadingProgress(\n    $input: SaveArticleReadingProgressInput!\n  ) {\n    saveArticleReadingProgress(input: $input) {\n      ... on SaveArticleReadingProgressSuccess {\n        updatedArticle {\n          id\n          readingProgressPercent\n          readingProgressAnchorIndex\n        }\n      }\n      ... on SaveArticleReadingProgressError {\n        errorCodes\n      }\n    }\n  }\n": types.SaveArticleReadingProgressDocument,
    "\n  mutation SetLinkArchived($input: ArchiveLinkInput!) {\n    setLinkArchived(input: $input) {\n      ... on ArchiveLinkSuccess {\n        linkId\n        message\n      }\n      ... on ArchiveLinkError {\n        message\n        errorCodes\n      }\n    }\n  }\n": types.SetLinkArchivedDocument,
    "\n  mutation SetBookmarkArticle($input: SetBookmarkArticleInput!) {\n    setBookmarkArticle(input: $input) {\n      ... on SetBookmarkArticleSuccess {\n        bookmarkedArticle {\n          id\n        }\n      }\n      ... on SetBookmarkArticleError {\n        errorCodes\n      }\n    }\n  }\n": types.SetBookmarkArticleDocument,
    "\n  mutation CreateLabel($input: CreateLabelInput!) {\n    createLabel(input: $input) {\n      ... on CreateLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on CreateLabelError {\n        errorCodes\n      }\n    }\n  }\n": types.CreateLabelDocument,
    "\n  mutation UpdateLabel($input: UpdateLabelInput!) {\n    updateLabel(input: $input) {\n      ... on UpdateLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on UpdateLabelError {\n        errorCodes\n      }\n    }\n  }\n": types.UpdateLabelDocument,
    "\n  mutation DeleteLabel($id: ID!) {\n    deleteLabel(id: $id) {\n      ... on DeleteLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on DeleteLabelError {\n        errorCodes\n      }\n    }\n  }\n": types.DeleteLabelDocument,
    "\n  mutation SetLabels($input: SetLabelsInput!) {\n    setLabels(input: $input) {\n      ... on SetLabelsSuccess {\n        labels {\n          ...LabelFields\n        }\n      }\n      ... on SetLabelsError {\n        errorCodes\n      }\n    }\n  }\n  \n": types.SetLabelsDocument,
    "\n  mutation UpdatePage($input: UpdatePageInput!) {\n    updatePage(input: $input) {\n      ... on UpdatePageSuccess {\n        updatedPage {\n          id\n          title\n          url\n          createdAt\n          author\n          image\n          description\n          savedAt\n          publishedAt\n        }\n      }\n      ... on UpdatePageError {\n        errorCodes\n      }\n    }\n  }\n": types.UpdatePageDocument,
    "\n          fragment ArchivedArticle on Article {\n            id\n            isArchived\n          }\n        ": types.ArchivedArticleFragmentDoc,
    "\n            fragment ReadingArticle on SearchItem {\n              id\n              readingProgressAnchorIndex\n              readingProgressPercent\n            }\n          ": types.ReadingArticleFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArticle($slug: String!) {\n    article(username: \"me\", slug: $slug, format: \"markdown\") {\n      ... on ArticleSuccess {\n        article {\n          ...ArticleFields\n          content\n          highlights(input: { includeFriends: false }) {\n            ...HighlightFields\n          }\n          labels {\n            ...LabelFields\n          }\n          recommendations {\n            ...RecommendationFields\n          }\n        }\n      }\n      ... on ArticleError {\n        errorCodes\n      }\n    }\n  }\n\n  fragment ArticleFields on Article {\n    id\n    title\n    folder\n    url\n    author\n    image\n    savedAt\n    createdAt\n    publishedAt\n    contentReader\n    originalArticleUrl\n    readingProgressPercent\n    readingProgressAnchorIndex\n    slug\n    isArchived\n    description\n    linkId\n    siteName\n    siteIcon\n    state\n    readAt\n    updatedAt\n    wordsCount\n  }\n\n  \n\n  \n\n  fragment RecommendationFields on Recommendation {\n    id\n    name\n    note\n    user {\n      userId\n      name\n      username\n      profileImageURL\n    }\n    recommendedAt\n  }\n"): (typeof documents)["\n  query GetArticle($slug: String!) {\n    article(username: \"me\", slug: $slug, format: \"markdown\") {\n      ... on ArticleSuccess {\n        article {\n          ...ArticleFields\n          content\n          highlights(input: { includeFriends: false }) {\n            ...HighlightFields\n          }\n          labels {\n            ...LabelFields\n          }\n          recommendations {\n            ...RecommendationFields\n          }\n        }\n      }\n      ... on ArticleError {\n        errorCodes\n      }\n    }\n  }\n\n  fragment ArticleFields on Article {\n    id\n    title\n    folder\n    url\n    author\n    image\n    savedAt\n    createdAt\n    publishedAt\n    contentReader\n    originalArticleUrl\n    readingProgressPercent\n    readingProgressAnchorIndex\n    slug\n    isArchived\n    description\n    linkId\n    siteName\n    siteIcon\n    state\n    readAt\n    updatedAt\n    wordsCount\n  }\n\n  \n\n  \n\n  fragment RecommendationFields on Recommendation {\n    id\n    name\n    note\n    user {\n      userId\n      name\n      username\n      profileImageURL\n    }\n    recommendedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TypeaheadSearch($query: String!) {\n    typeaheadSearch(query: $query) {\n      ... on TypeaheadSearchSuccess {\n        items {\n          id\n          title\n          slug\n          siteName\n          contentReader\n        }\n      }\n      ... on TypeaheadSearchError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  query TypeaheadSearch($query: String!) {\n    typeaheadSearch(query: $query) {\n      ... on TypeaheadSearchSuccess {\n        items {\n          id\n          title\n          slug\n          siteName\n          contentReader\n        }\n      }\n      ... on TypeaheadSearchError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LabelFields on Label {\n    id\n    name\n    color\n    description\n    createdAt\n    internal\n  }\n"): (typeof documents)["\n  fragment LabelFields on Label {\n    id\n    name\n    color\n    description\n    createdAt\n    internal\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HighlightFields on Highlight {\n    id\n    type\n    shortId\n    quote\n    prefix\n    suffix\n    patch\n    annotation\n    createdByMe\n    createdAt\n    updatedAt\n    sharedAt\n    highlightPositionPercent\n    highlightPositionAnchorIndex\n    labels {\n      ...LabelFields\n    }\n  }\n\n  \n"): (typeof documents)["\n  fragment HighlightFields on Highlight {\n    id\n    type\n    shortId\n    quote\n    prefix\n    suffix\n    patch\n    annotation\n    createdByMe\n    createdAt\n    updatedAt\n    sharedAt\n    highlightPositionPercent\n    highlightPositionAnchorIndex\n    labels {\n      ...LabelFields\n    }\n  }\n\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      picture\n      profile {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      name\n      picture\n      profile {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLabels {\n    labels {\n      ... on LabelsSuccess {\n        labels {\n          ...LabelFields\n        }\n      }\n      ... on LabelsError {\n        errorCodes\n      }\n    }\n  }\n\n  \n"): (typeof documents)["\n  query GetLabels {\n    labels {\n      ... on LabelsSuccess {\n        labels {\n          ...LabelFields\n        }\n      }\n      ... on LabelsError {\n        errorCodes\n      }\n    }\n  }\n\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Search(\n    $after: String\n    $first: Int\n    $query: String\n    $format: String\n    $includeContent: Boolean\n  ) {\n    search(\n      after: $after\n      first: $first\n      query: $query\n      format: $format\n      includeContent: $includeContent\n    ) {\n      ... on SearchSuccess {\n        edges {\n          cursor\n          node {\n            id\n            title\n            slug\n            url\n            pageType\n            contentReader\n            createdAt\n            isArchived\n            archivedAt\n            readingProgressPercent\n            readingProgressTopPercent\n            readingProgressAnchorIndex\n            author\n            image\n            description\n            publishedAt\n            ownedByViewer\n            originalArticleUrl\n            uploadFileId\n            labels {\n              id\n              name\n              color\n            }\n            color\n            pageId\n            shortId\n            quote\n            annotation\n            state\n            siteIcon\n            siteName\n            subscription\n            readAt\n            savedAt\n            wordsCount\n            recommendations {\n              id\n              name\n              note\n              user {\n                userId\n                name\n                username\n                profileImageURL\n              }\n              recommendedAt\n            }\n            highlights {\n              ...HighlightFields\n            }\n            feedContent\n            previewContentType\n            links\n            folder\n            aiSummary\n            directionality\n            format\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n          totalCount\n        }\n      }\n      ... on SearchError {\n        errorCodes\n      }\n    }\n  }\n\n  \n"): (typeof documents)["\n  query Search(\n    $after: String\n    $first: Int\n    $query: String\n    $format: String\n    $includeContent: Boolean\n  ) {\n    search(\n      after: $after\n      first: $first\n      query: $query\n      format: $format\n      includeContent: $includeContent\n    ) {\n      ... on SearchSuccess {\n        edges {\n          cursor\n          node {\n            id\n            title\n            slug\n            url\n            pageType\n            contentReader\n            createdAt\n            isArchived\n            archivedAt\n            readingProgressPercent\n            readingProgressTopPercent\n            readingProgressAnchorIndex\n            author\n            image\n            description\n            publishedAt\n            ownedByViewer\n            originalArticleUrl\n            uploadFileId\n            labels {\n              id\n              name\n              color\n            }\n            color\n            pageId\n            shortId\n            quote\n            annotation\n            state\n            siteIcon\n            siteName\n            subscription\n            readAt\n            savedAt\n            wordsCount\n            recommendations {\n              id\n              name\n              note\n              user {\n                userId\n                name\n                username\n                profileImageURL\n              }\n              recommendedAt\n            }\n            highlights {\n              ...HighlightFields\n            }\n            feedContent\n            previewContentType\n            links\n            folder\n            aiSummary\n            directionality\n            format\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n          totalCount\n        }\n      }\n      ... on SearchError {\n        errorCodes\n      }\n    }\n  }\n\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Subscribe($input: SubscribeInput!) {\n    subscribe(input: $input) {\n      ... on SubscribeSuccess {\n        subscriptions {\n          id\n        }\n      }\n      ... on SubscribeError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Subscribe($input: SubscribeInput!) {\n    subscribe(input: $input) {\n      ... on SubscribeSuccess {\n        subscriptions {\n          id\n        }\n      }\n      ... on SubscribeError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveUrl($input: SaveUrlInput!) {\n    saveUrl(input: $input) {\n      ... on SaveSuccess {\n        url\n        clientRequestId\n      }\n      ... on SaveError {\n        errorCodes\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveUrl($input: SaveUrlInput!) {\n    saveUrl(input: $input) {\n      ... on SaveSuccess {\n        url\n        clientRequestId\n      }\n      ... on SaveError {\n        errorCodes\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetNewsletterEmails {\n    newsletterEmails {\n      ... on NewsletterEmailsSuccess {\n        newsletterEmails {\n          id\n          address\n          createdAt\n          subscriptionCount\n        }\n      }\n\n      ... on NewsletterEmailsError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetNewsletterEmails {\n    newsletterEmails {\n      ... on NewsletterEmailsSuccess {\n        newsletterEmails {\n          id\n          address\n          createdAt\n          subscriptionCount\n        }\n      }\n\n      ... on NewsletterEmailsError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSubscriptions {\n    subscriptions {\n      ... on SubscriptionsSuccess {\n        subscriptions {\n          id\n          name\n          newsletterEmail\n          url\n          description\n          status\n          unsubscribeMailTo\n          unsubscribeHttpUrl\n          icon\n          type\n          count\n          lastFetchedAt\n          createdAt\n          updatedAt\n          isPrivate\n          autoAddToLibrary\n          fetchContent\n          fetchContentType\n          folder\n          mostRecentItemDate\n          refreshedAt\n          failedAt\n        }\n      }\n      ... on SubscriptionsError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSubscriptions {\n    subscriptions {\n      ... on SubscriptionsSuccess {\n        subscriptions {\n          id\n          name\n          newsletterEmail\n          url\n          description\n          status\n          unsubscribeMailTo\n          unsubscribeHttpUrl\n          icon\n          type\n          count\n          lastFetchedAt\n          createdAt\n          updatedAt\n          isPrivate\n          autoAddToLibrary\n          fetchContent\n          fetchContentType\n          folder\n          mostRecentItemDate\n          refreshedAt\n          failedAt\n        }\n      }\n      ... on SubscriptionsError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SavedSearches {\n    filters {\n      ... on FiltersSuccess {\n        filters {\n          ...FiltersFragment\n        }\n      }\n      ... on FiltersError {\n        errorCodes\n      }\n    }\n  }\n\n  fragment FiltersFragment on Filter {\n    id\n    name\n    filter\n    position\n    visible\n    defaultFilter\n    folder\n    category\n  }\n"): (typeof documents)["\n  query SavedSearches {\n    filters {\n      ... on FiltersSuccess {\n        filters {\n          ...FiltersFragment\n        }\n      }\n      ... on FiltersError {\n        errorCodes\n      }\n    }\n  }\n\n  fragment FiltersFragment on Filter {\n    id\n    name\n    filter\n    position\n    visible\n    defaultFilter\n    folder\n    category\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveFilter($input: SaveFilterInput!) {\n    saveFilter(input: $input) {\n      ... on SaveFilterSuccess {\n        filter {\n          id\n          name\n          filter\n          position\n          visible\n          defaultFilter\n          folder\n          category\n        }\n      }\n\n      ... on SaveFilterError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveFilter($input: SaveFilterInput!) {\n    saveFilter(input: $input) {\n      ... on SaveFilterSuccess {\n        filter {\n          id\n          name\n          filter\n          position\n          visible\n          defaultFilter\n          folder\n          category\n        }\n      }\n\n      ... on SaveFilterError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteFilter($id: ID!) {\n    deleteFilter(id: $id) {\n      ... on DeleteFilterSuccess {\n        filter {\n          id\n        }\n      }\n      ... on DeleteFilterError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteFilter($id: ID!) {\n    deleteFilter(id: $id) {\n      ... on DeleteFilterSuccess {\n        filter {\n          id\n        }\n      }\n      ... on DeleteFilterError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveArticleReadingProgress(\n    $input: SaveArticleReadingProgressInput!\n  ) {\n    saveArticleReadingProgress(input: $input) {\n      ... on SaveArticleReadingProgressSuccess {\n        updatedArticle {\n          id\n          readingProgressPercent\n          readingProgressAnchorIndex\n        }\n      }\n      ... on SaveArticleReadingProgressError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveArticleReadingProgress(\n    $input: SaveArticleReadingProgressInput!\n  ) {\n    saveArticleReadingProgress(input: $input) {\n      ... on SaveArticleReadingProgressSuccess {\n        updatedArticle {\n          id\n          readingProgressPercent\n          readingProgressAnchorIndex\n        }\n      }\n      ... on SaveArticleReadingProgressError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetLinkArchived($input: ArchiveLinkInput!) {\n    setLinkArchived(input: $input) {\n      ... on ArchiveLinkSuccess {\n        linkId\n        message\n      }\n      ... on ArchiveLinkError {\n        message\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SetLinkArchived($input: ArchiveLinkInput!) {\n    setLinkArchived(input: $input) {\n      ... on ArchiveLinkSuccess {\n        linkId\n        message\n      }\n      ... on ArchiveLinkError {\n        message\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetBookmarkArticle($input: SetBookmarkArticleInput!) {\n    setBookmarkArticle(input: $input) {\n      ... on SetBookmarkArticleSuccess {\n        bookmarkedArticle {\n          id\n        }\n      }\n      ... on SetBookmarkArticleError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SetBookmarkArticle($input: SetBookmarkArticleInput!) {\n    setBookmarkArticle(input: $input) {\n      ... on SetBookmarkArticleSuccess {\n        bookmarkedArticle {\n          id\n        }\n      }\n      ... on SetBookmarkArticleError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLabel($input: CreateLabelInput!) {\n    createLabel(input: $input) {\n      ... on CreateLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on CreateLabelError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLabel($input: CreateLabelInput!) {\n    createLabel(input: $input) {\n      ... on CreateLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on CreateLabelError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLabel($input: UpdateLabelInput!) {\n    updateLabel(input: $input) {\n      ... on UpdateLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on UpdateLabelError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLabel($input: UpdateLabelInput!) {\n    updateLabel(input: $input) {\n      ... on UpdateLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on UpdateLabelError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLabel($id: ID!) {\n    deleteLabel(id: $id) {\n      ... on DeleteLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on DeleteLabelError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteLabel($id: ID!) {\n    deleteLabel(id: $id) {\n      ... on DeleteLabelSuccess {\n        label {\n          id\n          name\n          color\n          description\n          createdAt\n          internal\n        }\n      }\n      ... on DeleteLabelError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetLabels($input: SetLabelsInput!) {\n    setLabels(input: $input) {\n      ... on SetLabelsSuccess {\n        labels {\n          ...LabelFields\n        }\n      }\n      ... on SetLabelsError {\n        errorCodes\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SetLabels($input: SetLabelsInput!) {\n    setLabels(input: $input) {\n      ... on SetLabelsSuccess {\n        labels {\n          ...LabelFields\n        }\n      }\n      ... on SetLabelsError {\n        errorCodes\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePage($input: UpdatePageInput!) {\n    updatePage(input: $input) {\n      ... on UpdatePageSuccess {\n        updatedPage {\n          id\n          title\n          url\n          createdAt\n          author\n          image\n          description\n          savedAt\n          publishedAt\n        }\n      }\n      ... on UpdatePageError {\n        errorCodes\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePage($input: UpdatePageInput!) {\n    updatePage(input: $input) {\n      ... on UpdatePageSuccess {\n        updatedPage {\n          id\n          title\n          url\n          createdAt\n          author\n          image\n          description\n          savedAt\n          publishedAt\n        }\n      }\n      ... on UpdatePageError {\n        errorCodes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          fragment ArchivedArticle on Article {\n            id\n            isArchived\n          }\n        "): (typeof documents)["\n          fragment ArchivedArticle on Article {\n            id\n            isArchived\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            fragment ReadingArticle on SearchItem {\n              id\n              readingProgressAnchorIndex\n              readingProgressPercent\n            }\n          "): (typeof documents)["\n            fragment ReadingArticle on SearchItem {\n              id\n              readingProgressAnchorIndex\n              readingProgressPercent\n            }\n          "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;