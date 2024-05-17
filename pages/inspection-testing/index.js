import React from 'react';

import Image from 'next/image';
import client from '../../src/components/ApolloClient';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';
import axios from "axios";
import Head from "next/head";
import {Breadcrumb} from "antd";

const index = ({ data }) => {
  return (
      <>
          <Head>
              <title>Inspection & Testing</title>
              <meta content="Inspection & Testing" />
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
                              title: 'Inspection & Testing',
                          }
                      ]}
                  />
              </div>
          </div>

          <div className='cms-content mx-auto py-16 pt-8'>
              <div className='container mx-auto'>
                  <div
                      className='font-semibold text-xl uppercase pb-6'
                      style={{color: 'var(--primary-color)'}}
                  >
                      <h1 className="page-title">Inspection & Testing</h1>
                  </div>
                  <div dangerouslySetInnerHTML={{__html: data?.content?.rendered}}/>
              </div>
          </div>
      </>
  );
};

export default index;

export async function getStaticProps(context) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const { data } = await axios.get(
        `${apiBaseUrl}/api/pages/2`
    );

  if (data) {
    return {
      props: {
        data,
      },
    };
  }
}
