import { gql } from '@apollo/client';

const GET_PAGE_BY_SLUG = gql`
  query GET_PAGE_BY_SLUG($slug: String!) {
    pageBy(uri: $slug) {
      id
      content
      title
      slug
      uri
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

export default GET_PAGE_BY_SLUG;