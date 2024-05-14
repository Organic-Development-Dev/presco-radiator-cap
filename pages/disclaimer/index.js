import React from 'react';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';
import client from '../../src/components/ApolloClient';

const index = ({ data }) => {
  return (
    <div className='disclaimer container mx-auto py-16 px-6 md:px-'>
      <div className='avia_textblock' itemProp='text'>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </div>
  );
};

export default index;

export async function getStaticProps(context) {
  const { data } = await client.query({
    query: GET_PAGE_BY_ID,
    variables: { id: 'cG9zdDo1NzI2' },
  });

  if (data) {
    return {
      props: {
        data: data.page,
      },
    };
  }
}
