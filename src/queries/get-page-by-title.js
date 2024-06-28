import { gql } from '@apollo/client';

const GET_PAGE_BY_ID = gql`
  query GET_PAGE_BY_ID($id: ID!) {
    page(id: $id) {
      id
      content
      title
      seo {
          canonical
          metaDesc
          metaKeywords
          metaRobotsNofollow
          metaRobotsNoindex
          opengraphAuthor
          opengraphDescription
          opengraphModifiedTime
          opengraphPublishedTime
          title
          twitterDescription
          twitterTitle
          opengraphUrl
          opengraphType
          opengraphTitle
          opengraphSiteName
        }
    }
  }
`;

export default GET_PAGE_BY_ID;
