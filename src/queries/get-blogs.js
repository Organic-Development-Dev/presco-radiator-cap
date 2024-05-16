import { gql } from '@apollo/client';

/**
 * GraphQL categories query.
 */
const GET_BLOGS = gql`
  query GET_BLOGS($limit: Int) {
    posts(last: $limit) {
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
