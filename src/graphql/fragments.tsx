import { gql } from "@apollo/client";

export const LABEL_FRAGMENT = gql`
  fragment LabelFields on Label {
    id
    name
    color
    description
    createdAt
    internal
  }
`;

export const HIGHLIGHT_FRAGMENT = gql`
  fragment HighlightFields on Highlight {
    id
    type
    shortId
    quote
    prefix
    suffix
    patch
    annotation
    createdByMe
    createdAt
    updatedAt
    sharedAt
    highlightPositionPercent
    highlightPositionAnchorIndex
    labels {
      ...LabelFields
    }
  }

  ${LABEL_FRAGMENT}
`;
