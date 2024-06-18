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
              src='/img/banner1.png'
              layout='fill'
              alt='banner'
              className='absolute'
              quality={80}
              priority // Preload the first image
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '30%' }}>
            <Image
              src='/img/banner2.png'
              layout='fill'
              alt='banner'
              className='absolute'
              quality={80}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '30%' }}>
            <Image
              src='/img/banner3.png'
              layout='fill'
              alt='banner'
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
