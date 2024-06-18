import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import GET_BLOGS from '../../queries/get-blogs';
import { useQuery } from '@apollo/client';

function LatestNews() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_BLOGS, {
    variables: {
      limit: 4,
    },
  });

  return (
    <div id='latest-news' className='container mx-auto py-10'>
      <div
        className='font-bold pb-8 text-center uppercase text-lg'
        style={{ color: 'var(--primary-color)' }}
      >
        Latest News
      </div>
      <div className='hidden grid-cols-4 gap-4 sm:grid'>
        {data?.posts?.nodes?.map((item) => (
          <div key={item.id} className='latest-news-item'>
            <Button
              onClick={() => router.push(`/blog/${item.slug}`)}
              className='btn-read-more'
            >
              Read more
            </Button>
            <Image
              src={
                  item?.featuredImage?.node?.mediaItemUrl ?? '/img/latest-news.png'
              }
              alt='latest-news'
              layout='responsive'
              width={285}
              height={235}
              className='rounded-lg'
              objecfit='cover'
              quality={90}
              priority
            />
          </div>
        ))}
        {/* <div className='latest-news-item'>
          <Button
            onClick={() => router.push('/news')}
            className='btn-read-more'
          >
            Read more
          </Button>
          <Image
            src='/img/latest-news2.png'
            alt='latest-news'
            layout='responsive'
            width={285}
            height={235}
            className='rounded-lg'
            objecfit='contain'
          />
        </div>
        <div className='latest-news-item'>
          <Button
            onClick={() => router.push('/news')}
            className='btn-read-more'
          >
            Read more
          </Button>
          <Image
            src='/img/latest-news3.png'
            alt='latest-news'
            layout='responsive'
            width={285}
            height={235}
            className='rounded-lg'
            objecfit='contain'
          />
        </div>
        <div className='latest-news-item'>
          <Button
            onClick={() => router.push('/news')}
            className='btn-read-more'
          >
            Read more
          </Button>
          <Image
            src='/img/latest-news.png'
            alt='latest-news'
            layout='responsive'
            width={285}
            height={235}
            className='rounded-lg'
            objecfit='contain'
          />
        </div> */}
      </div>
      <div className='px-10 sm:hidden'>
        <Swiper
          style={{ padding: '40px 0' }}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          className='sm:hidden'
        >
          {data?.posts?.nodes.map((item) => (
            <SwiperSlide
              key={item.id}
              onClick={() => router.push(`/blog/${item.slug}`)}
            >
              <Image
                src='/img/latest-news.png'
                alt='latest-news'
                layout='responsive'
                width={285}
                height={235}
                className='rounded-lg'
              />
            </SwiperSlide>
          ))}
          {/* <SwiperSlide>
            <Image
              src='/img/latest-news2.png'
              alt='latest-news'
              layout='responsive'
              width={285}
              height={235}
              className='rounded-lg'
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src='/img/latest-news3.png'
              alt='latest-news'
              layout='responsive'
              width={285}
              height={235}
              className='rounded-lg'
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src='/img/latest-news.png'
              alt='latest-news'
              layout='responsive'
              width={285}
              height={235}
              className='rounded-lg'
            />
          </SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  );
}

export default LatestNews;
