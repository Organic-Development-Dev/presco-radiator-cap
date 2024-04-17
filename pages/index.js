import React from 'react';
import Banner from '../src/components/home/banner';
import CoreValue from '../src/components/home/core-value';
import LatestNews from '../src/components/home/latest-news';
import OurProducts from '../src/components/home/our-product';
import Subscribe from '../src/components/home/subscriber';
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
      <Subscribe />
    </>
  );
}

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: PRODUCTS_AND_CATEGORIES_QUERY,
//   });
//   const channelSuccessId = '1090478363736547430';
//   const channelCryptoId = '1103743112548986902';
//   const { data: messagesSuccess } = await fetchChannelMessages(
//     channelSuccessId
//   );
//   const { data: messagesCrypto } = await fetchChannelMessages(channelCryptoId);

//   return {
//     props: {
//       productCategories: data?.productCategories?.nodes
//         ? data.productCategories.nodes
//         : [],
//       products: data?.products?.nodes ? data.products.nodes : [],
//       heroCarousel: data?.heroCarousel?.nodes[0]?.children?.nodes
//         ? data.heroCarousel.nodes[0].children.nodes
//         : [],
//       messagesSuccess: messagesSuccess,
//       messagesCrypto: messagesCrypto,
//     },
//     revalidate: 1,
//   };
// }
