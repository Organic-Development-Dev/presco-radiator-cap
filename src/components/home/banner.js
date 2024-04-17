import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';
import Image from 'next/image';



function Banner() {
  return (
    <div id='banner'>
      <Swiper
        style={{ padding: '40px 0' }}
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Pagination]}
      >
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '27.5%' }}>
            <Image
              src='/fake-image-delete-in-future/banner.png'
              layout='fill'
              alt='banner'
              className='absolute'
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '27.5%' }}>
            <Image
              src='/fake-image-delete-in-future/banner.png'
              layout='fill'
              alt='banner'
              className='absolute'
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='relative' style={{ paddingTop: '27.5%' }}>
            <Image
              src='/fake-image-delete-in-future/banner.png'
              layout='fill'
              alt='banner'
              className='absolute'
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Banner;
