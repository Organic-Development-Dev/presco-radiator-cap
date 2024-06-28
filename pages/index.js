import React from 'react';
import axios from "axios";
import dynamic from 'next/dynamic';
import Head from "next/head";


const Banner = dynamic(() => import('../src/components/home/banner'));
const LatestNews = dynamic(() => import('../src/components/home/latest-news'));
const Testimonials = dynamic(() => import('../src/components/home/testimonials'));

function Home({ data }) {
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
          <Banner/>
          <div className='cms-content'>
              <div className='container mx-auto'>
                  <div dangerouslySetInnerHTML={{__html: data?.content?.rendered}}/>
              </div>
          </div>
          <LatestNews/>
          <Testimonials/>
      </>
  );
}

export default Home;

export async function getStaticProps(context) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const { data } = await axios.get(`${apiBaseUrl}/api/pages/6932`);
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
