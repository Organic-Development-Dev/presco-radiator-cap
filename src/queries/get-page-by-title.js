import { gql } from '@apollo/client';

const GET_PAGE_BY_TITLE = gql`
  query GET_PAGE_BY_TITLE($title: String!) {
    pages(where: { title: $title }) {
      nodes {
        id
        content
        title
      }
    }
  }
`;

export default GET_PAGE_BY_TITLE;
