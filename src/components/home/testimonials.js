import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Avatar } from 'antd';
import Image from 'next/image';

const dataFeedBack = [
  {
    avatar: 'person1.png',
    description:
      'We are proud to be a partner with Presco as our radiator Cap supplier in the UK. Their commitment to excellence and reliability has been instrumental in meeting our radiator Cap needs efficiently. With their high-quality products and exceptional service, Presco has consistently exceeded our expectations, ensuring our facilities remain comfortable and energy-efficient. We highly recommend Presco to any organization seeking top-notch radiator-cap solutions and outstanding customer support',
    name: 'Subair .U',
    subname: 'Chairman &  MD',
    position: 'CoolLine Group – U.A.E',
  }
];

function Testimonials() {
  return (
    <div id='testimonials' className='container mx-auto py-10 px-8'>
      <div className='text-lg text-center'>
        <div
          className='font-thin uppercase'
          style={{ color: 'var(--primary-color)' }}
        >
          Tesimonials
        </div>
        <div
          className='font-bold uppercase'
          style={{ color: 'var(--primary-color)' }}
        >
          What our clients say
        </div>
      </div>
      <div>
        <Swiper
          style={{
            padding: '40px 0',
            '--swiper-navigation-color': 'var(--primary-color)',
            '--swiper-navigation-sides-offset': '300px',
            '--swiper-pagination-bullet-size': '12px',
            '--swiper-pagination-bottom': '50px',
            '--swiper-pagination-color': '#fff',
          }}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            320: {
              navigation: {
                enabled: false,
                disabledClass: 'display-none',
              },
            },
            640: {
              navigation: {
                enabled: true,
              },
            },
          }}
        >
          {dataFeedBack.map((feedback) => (
            <SwiperSlide key={feedback.avatar}>
                <div
                    className='text-center rounded-3xl mx-auto p-4 testimonials-slider-item pb-8'
                    style={{
                        boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div style={{width: 18}} className='mx-auto pt-4'>
                        <Image
                            src='/img/feed-back.png'
                            layout='responsive'
                            alt='feedback'
                            width={78}
                            height={78}
                        />
                    </div>
                    <div
                        style={{color: '#3A3A3A'}}
                        className='font-thin text-xs pt-4'
                        dangerouslySetInnerHTML={{__html: feedback.description}}
                    />
                    <div
                        className='font-semibold name text-xs uppercase pt-6'
                    >
                        {feedback.name}
                    </div>
                    <div
                        className='font-normal subname text-xs pt-2'
                        style={{color: '#3A3A3A'}}
                    >
                        {feedback.subname}
                    </div>
                    <div
                        className='font-normal position text-xs pt-2'
                        style={{color: '#3A3A3A'}}
                    >
                        {feedback.position}
                    </div>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonials;
