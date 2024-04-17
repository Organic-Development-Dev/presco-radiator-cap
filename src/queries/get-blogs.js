import { gql } from '@apollo/client';

/**
 * GraphQL categories query.
 */
const GET_BLOGS = gql`
  query {
    posts {
      nodes {
        id
        slug
        title
        content
      }
    }
  }
`;

export default GET_BLOGS;
