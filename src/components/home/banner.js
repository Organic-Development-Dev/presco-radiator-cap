import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Head from 'next/head';

function Banner() {
  // Use a state to handle image loading for better Core Web Vitals
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Mark images as loaded after component mounts
  useEffect(() => {
    setImagesLoaded(true);
  }, []);
  
  return (
    <>
      {/* Add preload link for critical image */}
      <Head>
        <link
          rel="preload"
          href="/img/banner1.webp"
          as="image"
          type="image/webp"
        />
      </Head>
      
      <div id='banner'>
        <Swiper
          style={{ paddingBottom: '40px' }}
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            // Wait for images to load before starting autoplay
            delay: imagesLoaded ? 2500 : 5000
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          modules={[Autoplay, Pagination]}
        >
          <SwiperSlide>
            <div className='relative' style={{ paddingTop: '30%', backgroundColor: '#f5f5f5' }}>
              <Image
                src='/img/banner1.webp'
                alt='Presco Radiator Caps - Premium Automotive Components'
                className='absolute object-cover'
                priority={true}
                quality={85}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='relative' style={{ paddingTop: '30%', backgroundColor: '#f5f5f5' }}>
              <Image
                src='/img/banner2.webp'
                alt='High-Performance Radiator Caps for All Vehicle Types'
                className='absolute object-cover'
                quality={75}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='relative' style={{ paddingTop: '30%', backgroundColor: '#f5f5f5' }}>
              <Image
                src='/img/banner3.webp'
                alt='Quality Engineered Cooling System Components'
                className='absolute object-cover'
                quality={75}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}

export default Banner;
