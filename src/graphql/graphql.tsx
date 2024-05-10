import { gql } from "@apollo/client";
import {
  GetLabelsQuery,
  GetNewsletterEmailsQuery,
  GetSubscriptionsQuery,
  SavedSearchesQuery,
} from "../__generated__/graphql";
import { HIGHLIGHT_FRAGMENT, LABEL_FRAGMENT } from "./fragments";

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      picture
      profile {
        id
        username
      }
    }
  }
`;

export const GET_LABELS = gql`
  query GetLabels {
    labels {
      ... on LabelsSuccess {
        labels {
          ...LabelFields
        }
      }
      ... on LabelsError {
        errorCodes
      }
    }
  }

  ${LABEL_FRAGMENT}
`;

export const GET_FEED_ARTICLES = gql`
  query Search(
    $after: String
    $first: Int
    $query: String
    $format: String
    $includeContent: Boolean
  ) {
    search(
      after: $after
      first: $first
      query: $query
      format: $format
      includeContent: $includeContent
    ) {
      ... on SearchSuccess {
        edges {
          cursor
          node {
            id
            title
            slug
            url
            pageType
            contentReader
            createdAt
            isArchived
            archivedAt
            readingProgressPercent
            readingProgressTopPercent
            readingProgressAnchorIndex
            author
            image
            description
            publishedAt
            ownedByViewer
            originalArticleUrl
            uploadFileId
            labels {
              id
              name
              color
            }
            color
            pageId
            shortId
            quote
            annotation
            state
            siteIcon
            siteName
            subscription
            readAt
            savedAt
            wordsCount
            recommendations {
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
            highlights {
              ...HighlightFields
            }
            feedContent
            previewContentType
            links
            folder
            aiSummary
            directionality
            format
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
          totalCount
        }
      }
      ... on SearchError {
        errorCodes
      }
    }
  }

  ${HIGHLIGHT_FRAGMENT}
`;

// input is {url: "", subscriptionType: "RSS"}
export const ADD_RSS_MUTATION = gql`
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
      ... on SubscribeSuccess {
        subscriptions {
          id
        }
      }
      ... on SubscribeError {
        errorCodes
      }
    }
  }
`;

export const ADD_URL_MUTATION = gql`
  mutation SaveUrl($input: SaveUrlInput!) {
    saveUrl(input: $input) {
      ... on SaveSuccess {
        url
        clientRequestId
      }
      ... on SaveError {
        errorCodes
        message
      }
    }
  }
`;

export const GET_NEWSLETTER_EMAIL = gql`
  query GetNewsletterEmails {
    newsletterEmails {
      ... on NewsletterEmailsSuccess {
        newsletterEmails {
          id
          address
          createdAt
          subscriptionCount
        }
      }

      ... on NewsletterEmailsError {
        errorCodes
      }
    }
  }
`;

export const GET_SUBS = gql`
  query GetSubscriptions {
    subscriptions {
      ... on SubscriptionsSuccess {
        subscriptions {
          id
          name
          newsletterEmail
          url
          description
          status
          unsubscribeMailTo
          unsubscribeHttpUrl
          icon
          type
          count
          lastFetchedAt
          createdAt
          updatedAt
          isPrivate
          autoAddToLibrary
          fetchContent
          fetchContentType
          folder
          mostRecentItemDate
          refreshedAt
          failedAt
        }
      }
      ... on SubscriptionsError {
        errorCodes
      }
    }
  }
`;

export const GET_FILTERS = gql`
  query SavedSearches {
    filters {
      ... on FiltersSuccess {
        filters {
          ...FiltersFragment
        }
      }
      ... on FiltersError {
        errorCodes
      }
    }
  }

  fragment FiltersFragment on Filter {
    id
    name
    filter
    position
    visible
    defaultFilter
    folder
    category
  }
`;

export const CREATE_FILTER = gql`
  mutation SaveFilter($input: SaveFilterInput!) {
    saveFilter(input: $input) {
      ... on SaveFilterSuccess {
        filter {
          id
          name
          filter
          position
          visible
          defaultFilter
          folder
          category
        }
      }

      ... on SaveFilterError {
        errorCodes
      }
    }
  }
`;

export const DELETE_FILTER = gql`
  mutation DeleteFilter($id: ID!) {
    deleteFilter(id: $id) {
      ... on DeleteFilterSuccess {
        filter {
          id
        }
      }
      ... on DeleteFilterError {
        errorCodes
      }
    }
  }
`;

export type SubscriptionItem = Extract<
  GetSubscriptionsQuery["subscriptions"],
  { __typename?: "SubscriptionsSuccess" }
>["subscriptions"][0];

export type FilterItem = Extract<
  SavedSearchesQuery["filters"],
  { __typename?: "FiltersSuccess" }
>["filters"][0];

export type LabelItem = Extract<
  GetLabelsQuery["labels"],
  { __typename?: "LabelsSuccess" }
>["labels"][0];

export type NewsletterEmailItem = Extract<
  GetNewsletterEmailsQuery["newsletterEmails"],
  { __typename?: "NewsletterEmailsSuccess" }
>["newsletterEmails"][0];

export const SAVE_READING_PROGRESS = gql`
  mutation SaveArticleReadingProgress(
    $input: SaveArticleReadingProgressInput!
  ) {
    saveArticleReadingProgress(input: $input) {
      ... on SaveArticleReadingProgressSuccess {
        updatedArticle {
          id
          readingProgressPercent
          readingProgressAnchorIndex
        }
      }
      ... on SaveArticleReadingProgressError {
        errorCodes
      }
    }
  }
`;

export const ARCHIVE_ARTICLE = gql`
  mutation SetLinkArchived($input: ArchiveLinkInput!) {
    setLinkArchived(input: $input) {
      ... on ArchiveLinkSuccess {
        linkId
        message
      }
      ... on ArchiveLinkError {
        message
        errorCodes
      }
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation SetBookmarkArticle($input: SetBookmarkArticleInput!) {
    setBookmarkArticle(input: $input) {
      ... on SetBookmarkArticleSuccess {
        bookmarkedArticle {
          id
        }
      }
      ... on SetBookmarkArticleError {
        errorCodes
      }
    }
  }
`;

export const CREATE_LABEL = gql`
  mutation CreateLabel($input: CreateLabelInput!) {
    createLabel(input: $input) {
      ... on CreateLabelSuccess {
        label {
          id
          name
          color
          description
          createdAt
          internal
        }
      }
      ... on CreateLabelError {
        errorCodes
      }
    }
  }
`;

export const UPDATE_LABEL = gql`
  mutation UpdateLabel($input: UpdateLabelInput!) {
    updateLabel(input: $input) {
      ... on UpdateLabelSuccess {
        label {
          id
          name
          color
          description
          createdAt
          internal
        }
      }
      ... on UpdateLabelError {
        errorCodes
      }
    }
  }
`;

export const DELETE_LABEL = gql`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      ... on DeleteLabelSuccess {
        label {
          id
          name
          color
          description
          createdAt
          internal
        }
      }
      ... on DeleteLabelError {
        errorCodes
      }
    }
  }
`;

export const SET_LABELS = gql`
  mutation SetLabels($input: SetLabelsInput!) {
    setLabels(input: $input) {
      ... on SetLabelsSuccess {
        labels {
          ...LabelFields
        }
      }
      ... on SetLabelsError {
        errorCodes
      }
    }
  }
  ${LABEL_FRAGMENT}
`;

export const UPDATE_PAGE_INFO = gql`
  mutation UpdatePage($input: UpdatePageInput!) {
    updatePage(input: $input) {
      ... on UpdatePageSuccess {
        updatedPage {
          id
          title
          url
          createdAt
          author
          image
          description
          savedAt
          publishedAt
        }
      }
      ... on UpdatePageError {
        errorCodes
      }
    }
  }
`;
