import { gql } from 'graphql-request';

export const query = gql`
  query userSearch(
    $q: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    search(
      first: $first
      last: $last
      type: USER
      query: $q
      after: $after
      before: $before
    ) {
      userCount
      pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
      edges {
        node {
          ... on User {
            name
            login
          }
        }
      }
    }
  }
`;
