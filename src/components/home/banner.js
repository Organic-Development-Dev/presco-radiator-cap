import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

function Banner() {
  return (
    <div id='banner'>
      <Swiper
        style={{ paddingBottom: '40px' }}
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination]}
      >
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '30%' }}>
            <Image
              src='/img/banner1.webp'
              layout='fill'
              alt='banner1'
              className='absolute'
              quality={80}
              priority // Preload the first image
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '30%' }}>
            <Image
              src='/img/banner2.webp'
              layout='fill'
              alt='banner2'
              className='absolute'
              quality={80}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '30%' }}>
            <Image
              src='/img/banner3.webp'
              layout='fill'
              alt='banner3'
              className='absolute'
              quality={80}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Banner;
