import React from 'react';
import GET_PAGE_BY_TITLE from '../../src/queries/get-page-by-title';
import { useQuery } from '@apollo/client';
import client from '../../src/components/ApolloClient';

const index = ({ data }) => {
  console.log(data);
  return (
    <div className='privacy-container container mx-auto py-16 px-6 md:px'>
      <div className='leading-6' itemProp='text'>
        {/* <h3>
          <strong>{data.title}</strong>
        </h3> */}
        <div dangerouslySetInnerHTML={{ __html: data?.content }} />
      </div>
    </div>
  );
};

export default index;

export async function getStaticProps(context) {
  const { data } = await client.query({
    query: GET_PAGE_BY_TITLE,
    variables: { title: 'PRIVACY POLICY' },
  });

  if (data) {
    return {
      props: {
        data: data.pages.nodes[0],
      },
    };
  }
}
