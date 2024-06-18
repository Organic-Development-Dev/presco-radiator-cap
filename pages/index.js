import React from 'react';
import axios from "axios";
import dynamic from 'next/dynamic';


const Banner = dynamic(() => import('../src/components/home/banner'));
const LatestNews = dynamic(() => import('../src/components/home/latest-news'));
const Testimonials = dynamic(() => import('../src/components/home/testimonials'));

function Home({ data }) {
  return (
      <>
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
