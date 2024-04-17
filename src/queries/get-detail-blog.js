import { gql } from '@apollo/client';

/**
 * GraphQL categories query.
 */
const GET_DETAIL_BLOG = gql`
  query GET_DETAIL_BLOG($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      content
      postId
      title
      author {
        node {
          id
          name
        }
      }
      contentType {
        node {
          id
        }
      }
    }
  }
`;

export default GET_DETAIL_BLOG;
