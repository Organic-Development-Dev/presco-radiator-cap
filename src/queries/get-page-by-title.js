import { gql } from '@apollo/client';

const GET_PAGE_BY_ID = gql`
  query GET_PAGE_BY_ID($id: ID!) {
    page(id: $id) {
      id
      content
      title
    }
  }
`;

export default GET_PAGE_BY_ID;
