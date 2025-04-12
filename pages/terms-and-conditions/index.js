import React from 'react';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';
import client from '../../src/components/ApolloClient';
import { Breadcrumb } from "antd";
import SEO from '../../src/components/SEO';
import Link from 'next/link';

const TermsAndConditions = ({ data: dataPage }) => {
  // Create structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": dataPage.title || "Terms and Conditions",
    "description": dataPage?.seo?.metaDesc || "Terms and Conditions - Presco Radiator Caps",
    "publisher": {
      "@type": "Organization",
      "name": "Presco Radiator Caps",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.presco-radiator-caps.com/img/logo.png"
      }
    }
  };

  return (
    <>
      <SEO 
        title={dataPage.title || "Terms and Conditions"}
        description={dataPage?.seo?.metaDesc || "Terms and Conditions - Presco Radiator Caps"}
        canonicalUrl="https://www.presco-radiator-caps.com/terms-and-conditions/"
        structuredData={structuredData}
      />
      
      <div style={{ backgroundColor: '#F6F6F6' }}>
        <div className='container mx-auto py-4 px-4 sm:px-0'>
          <Breadcrumb
            style={{ color: 'var(--primary-color)' }}
            items={[
              {
                title: <Link href="/">Home</Link>,
              },
              {
                title: 'Terms and Conditions',
              }
            ]}
          />
        </div>
      </div>
      
      <main className='terms-content container mx-auto py-16 pt-8 px-4 sm:px-0'>
        <h1 className="text-3xl font-bold mb-6">{dataPage.title || "Terms and Conditions"}</h1>
        <div className='avia_textblock' itemProp='text'>
          <div dangerouslySetInnerHTML={{__html: dataPage.content}}/>
        </div>
      </main>
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