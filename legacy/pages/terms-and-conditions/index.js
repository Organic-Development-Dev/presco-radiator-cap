import React from 'react';
import GET_PAGE_BY_SLUG from '../../src/queries/get-page-by-slug';
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
    // Use the slug to fetch the page - this is more reliable than using IDs
    const {data} = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: {slug: 'terms-and-conditions'}, // Use the slug instead of ID
    });

    if (data?.pageBy) {
      // Return the page data if found
      return {
        props: {
          data: data.pageBy,
        },
        // Revalidate every 24 hours
        revalidate: 86400,
      };
    } else {
      // Try to fetch by alternative slug
      try {
        const altData = await client.query({
          query: GET_PAGE_BY_SLUG,
          variables: {slug: 'terms'}, // Try alternative slug
        });
        
        if (altData?.data?.pageBy) {
          return {
            props: {
              data: altData.data.pageBy,
            },
            revalidate: 86400,
          };
        }
      } catch (altError) {
        console.error('Error fetching with alternative slug:', altError);
      }
      
      // If page not found, return a fallback page
      return {
        props: {
          data: {
            title: 'Terms and Conditions',
            content: `
              <h2>Terms and Conditions</h2>
              <p>Welcome to Presco Radiator Caps Ltd. These Terms and Conditions govern your use of our website and the purchase of products from our online store.</p>
              <p>By accessing our website or purchasing our products, you agree to these Terms and Conditions in full. If you disagree with any part of these terms, please do not use our website or services.</p>
              <p>Our website is currently being updated with our complete terms and conditions. Please check back soon for the full details or contact our customer service team for more information.</p>
              <p>For any questions regarding our terms and conditions, please contact us at:</p>
              <p>
                <strong>Presco Radiator Caps Ltd.</strong><br />
                Unit D86, Blackpole Trading Estate<br />
                West, Worcester, England, WR3 8TJ<br />
                Email: sales@presco-radiator-caps.com<br />
                Phone: +44 (0)1905 755656
              </p>
            `,
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
          content: `
            <h2>Terms and Conditions</h2>
            <p>Welcome to Presco Radiator Caps Ltd. These Terms and Conditions govern your use of our website and the purchase of products from our online store.</p>
            <p>By accessing our website or purchasing our products, you agree to these Terms and Conditions in full. If you disagree with any part of these terms, please do not use our website or services.</p>
            <p>Our website is currently being updated with our complete terms and conditions. Please check back soon for the full details or contact our customer service team for more information.</p>
            <p>For any questions regarding our terms and conditions, please contact us at:</p>
            <p>
              <strong>Presco Radiator Caps Ltd.</strong><br />
              Unit D86, Blackpole Trading Estate<br />
              West, Worcester, England, WR3 8TJ<br />
              Email: sales@presco-radiator-caps.com<br />
              Phone: +44 (0)1905 755656
            </p>
          `,
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