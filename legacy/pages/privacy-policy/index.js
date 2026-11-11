import React from 'react';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';
import { useQuery } from '@apollo/client';
import client from '../../src/components/ApolloClient';
import Head from "next/head";
import {Breadcrumb} from "antd";

const index = ({ data: dataPage }) => {
  return (
      <>
          <Head>
              <title>{dataPage.title}</title>
              <meta content={dataPage?.seo?.metaDesc ? dataPage.seo.metaDesc : 'Presco Radiator Caps'}/>
              <meta name="description" content={dataPage?.seo?.metaDesc ? dataPage.seo.metaDesc : 'Presco Radiator Caps'}/>
              <meta property="og:locale" content="en_US"/>
              <meta property="og:site_name" content={dataPage?.seo?.opengraphSiteName ? dataPage.seo.opengraphSiteName : 'Presco Radiator Caps'}/>
              <meta property="og:url" content="https://www.presco-radiator-caps.com"/>
              <meta property="og:title" content={dataPage?.seo?.title ? dataPage.seo.title : dataPage.title}/>
              <meta property="og:type" content={dataPage?.seo?.opengraphType}/>
              <meta property="og:description" content={dataPage?.seo?.opengraphDescription ? dataPage.seo.opengraphDescription : 'Presco Radiator Caps'}/>
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
                    title: 'Privacy Policy',
                  }
                ]}
            />
          </div>
        </div>
        <div className='privacy-container container mx-auto py-16 pt-8'>
          <div className='leading-6' itemProp='text'>
            {/* <h3>
          <strong>{data.title}</strong>
        </h3> */}
            <div dangerouslySetInnerHTML={{__html: dataPage?.content}}/>
          </div>
        </div>
      </>
  );
};

export default index;

export async function getStaticProps(context) {
  const {data} = await client.query({
    query: GET_PAGE_BY_ID,
    variables: {id: 'cG9zdDo1NzIw'},
  });

  if (data) {
    return {
      props: {
        data: data.page,
      },
    };
  }
}
