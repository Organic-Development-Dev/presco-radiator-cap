import React from 'react';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';
import client from '../../src/components/ApolloClient';
import Head from "next/head";
import {Breadcrumb} from "antd";

const TermsAndConditions = ({ data: dataPage }) => {
  return (
    <>
      <Head>
        <title>{dataPage.title}</title>
        <meta content={dataPage?.seo?.metaDesc ? dataPage.seo.metaDesc : 'Terms and Conditions - Presco Radiator Caps'}/>
        <meta name="description" content={dataPage?.seo?.metaDesc ? dataPage.seo.metaDesc : 'Terms and Conditions - Presco Radiator Caps'}/>
        <meta property="og:locale" content="en_US"/>
        <meta property="og:site_name" content={dataPage?.seo?.opengraphSiteName ? dataPage.seo.opengraphSiteName : 'Presco Radiator Caps'}/>
        <meta property="og:url" content="https://www.presco-radiator-caps.com/terms-and-conditions"/>
        <meta property="og:title" content={dataPage?.seo?.title ? dataPage.seo.title : dataPage.title}/>
        <meta property="og:type" content={dataPage?.seo?.opengraphType}/>
        <meta property="og:description" content={dataPage?.seo?.opengraphDescription ? dataPage.seo.opengraphDescription : 'Terms and Conditions - Presco Radiator Caps'}/>
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
                title: 'Terms and Conditions',
              }
            ]}
          />
        </div>
      </div>
      <div className='terms-content container mx-auto py-16 pt-8'>
        <div className='avia_textblock' itemProp='text'>
          <div dangerouslySetInnerHTML={{__html: dataPage.content}}/>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;

export async function getStaticProps(context) {
  try {
    const {data} = await client.query({
      query: GET_PAGE_BY_ID,
      variables: {id: 'cG9zdDo1NzI3'}, // Use the Terms & Conditions page ID from WordPress
    });

    if (data?.page) {
      return {
        props: {
          data: data.page,
        },
      };
    } else {
      // If page not found, return a fallback page
      return {
        props: {
          data: {
            title: 'Terms and Conditions',
            content: '<h1>Terms and Conditions</h1><p>The terms and conditions page is currently being updated. Please check back later.</p>',
            seo: {
              metaDesc: 'Terms and Conditions - Presco Radiator Caps',
              opengraphSiteName: 'Presco Radiator Caps',
              opengraphType: 'website',
              opengraphDescription: 'Terms and Conditions - Presco Radiator Caps',
            }
          },
        },
      };
    }
  } catch (error) {
    console.error('Error fetching Terms and Conditions page:', error);
    
    // Return fallback content in case of error
    return {
      props: {
        data: {
          title: 'Terms and Conditions',
          content: '<h1>Terms and Conditions</h1><p>The terms and conditions page is currently being updated. Please check back later.</p>',
          seo: {
            metaDesc: 'Terms and Conditions - Presco Radiator Caps',
            opengraphSiteName: 'Presco Radiator Caps',
            opengraphType: 'website',
            opengraphDescription: 'Terms and Conditions - Presco Radiator Caps',
          }
        },
      },
    };
  }
}