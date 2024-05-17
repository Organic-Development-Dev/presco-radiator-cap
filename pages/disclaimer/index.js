import React from 'react';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';
import client from '../../src/components/ApolloClient';
import Head from "next/head";
import {Breadcrumb} from "antd";

const index = ({ data }) => {
  return (
      <>
        <Head>
          <title>Disclaimer</title>
          <meta content="Disclaimer" />
        </Head>
        <div style={{ backgroundColor: '#F6F6F6' }}>
          <div className='container mx-auto py-4'>
            <Breadcrumb
                style={{ color: 'var(--primary-color)' }}
                items={[
                  {
                    title: 'Home',
                  },
                  {
                    title: 'Disclaimer',
                  }
                ]}
            />
          </div>
        </div>
        <div className='disclaimer-content container mx-auto py-16 pt-8'>
          <div className='avia_textblock' itemProp='text'>
            <div dangerouslySetInnerHTML={{__html: data.content}}/>
          </div>
        </div>
      </>
  );
};

export default index;

export async function getStaticProps(context) {
  const {data} = await client.query({
    query: GET_PAGE_BY_ID,
    variables: {id: 'cG9zdDo1NzI2'},
  });

  if (data) {
    return {
      props: {
        data: data.page,
      },
    };
  }
}
