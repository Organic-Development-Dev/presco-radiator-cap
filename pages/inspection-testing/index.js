import React from 'react';
import axios from "axios";
import Head from "next/head";
import {Breadcrumb} from "antd";

function Index({ data }) {
  return (
      <>
          <Head>
              <title>{data?.yoast_head_json?.title}</title>
              <meta content={data?.yoast_head_json?.og_title}/>
              <meta name="description" content={data?.yoast_head_json?.og_description ?? 'Presco Radiator Caps'}/>
              <meta property="og:locale" content={data?.yoast_head_json?.og_locale}/>
              <meta property="og:site_name" content={data?.yoast_head_json?.og_site_name}/>
              <meta property="og:url" content="https://www.presco-radiator-caps.com"/>
              <meta property="og:title" content={data?.yoast_head_json?.og_title}/>
              <meta property="og:type" content={data?.yoast_head_json?.og_type}/>
              <meta property="og:description" content={data?.yoast_head_json?.og_description}/>
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

export default Index;

export async function getStaticProps(context) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const { data } = await axios.get(`${apiBaseUrl}/api/pages/2`);
        return {
            props: {
                data,
            },
            revalidate: 1,
        };
    } catch (error) {
        console.error('Error fetching data in getStaticProps', error);
        return {
            props: {
                data: null,
            },
            revalidate: 1,
        };
    }
}
