import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
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
        {/* Simple mobile news carousel */}
        <MobileNewsCarousel news={data?.posts?.nodes || []} router={router} />
      </div>
    </div>
  );
}

// Simple mobile news carousel component
function MobileNewsCarousel({ news, router }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const newsItems = news.length > 0 ? news : [
    { id: 1, title: 'Latest News', slug: '/news' },
    { id: 2, title: 'Latest Updates', slug: '/news' },
    { id: 3, title: 'Company News', slug: '/news' },
  ];
  
  // Auto advance slides
  useEffect(() => {
    if (newsItems.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [newsItems.length]);
  
  if (newsItems.length === 0) {
    return null;
  }
  
  return (
    <div className="relative py-4">
      {/* Current news slide */}
      <div 
        className="latest-news-item relative cursor-pointer"
        onClick={() => router.push(`/blog/${newsItems[currentSlide].slug}`)}
      >
        <Image
          src={newsItems[currentSlide]?.featuredImage?.node?.mediaItemUrl || '/img/latest-news.png'}
          alt={newsItems[currentSlide]?.title || 'Latest news'}
          width={285}
          height={235}
          className="rounded-lg"
        />
        <Button className="btn-read-more absolute bottom-2 right-2">
          Read more
        </Button>
      </div>
      
      {/* Navigation dots */}
      {newsItems.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Go to news item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestNews;
