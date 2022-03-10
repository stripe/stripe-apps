import { gql } from 'graphql-request';

export const query = gql`
  query profile($login: String!) {
    user(login: $login) {
      login
      name
      bio
      company
      email
      organizations(first: 5) {
        nodes {
          name
        }
      }
      projects(first: 5) {
        nodes {
          name
        }
      }
      topRepositories(
        first: 5
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          name
        }
      }
      twitterUsername
      websiteUrl
    }
  }
`;
