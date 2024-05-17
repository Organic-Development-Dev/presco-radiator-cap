import React from 'react';
import Banner from '../src/components/home/banner';
import CoreValue from '../src/components/home/core-value';
import LatestNews from '../src/components/home/latest-news';
import OurProducts from '../src/components/home/our-product';
import TeamMembers from '../src/components/home/team-member';
import Testimonials from '../src/components/home/testimonials';
import axios from "axios";

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
