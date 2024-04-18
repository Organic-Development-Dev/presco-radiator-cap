import React from 'react';
import Banner from '../src/components/home/banner';
import CoreValue from '../src/components/home/core-value';
import LatestNews from '../src/components/home/latest-news';
import OurProducts from '../src/components/home/our-product';
import TeamMembers from '../src/components/home/team-member';
import Testimonials from '../src/components/home/testimonials';

export default function Home() {
  return (
    <>
      <Banner />
      <CoreValue />
      <OurProducts />
      <TeamMembers />
      <LatestNews />
      <Testimonials />
    </>
  );
}
