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
      'Presco also boasts impressive engineering capabilities, with CAD, CAM, wire <br /> erosion, and tooling manufacture facilities. This allows them to design and <br /> develop new applications to better serve their customers. They even <br /> accommodate specific requirements concerning product identity and <br /> visual appearance upon request.',
  },
  {
    avatar: 'person2.png',
    description:
      'Presco also boasts impressive engineering capabilities, with CAD, CAM, wire <br /> erosion, and tooling manufacture facilities. This allows them to design and <br /> develop new applications to better serve their customers. They even <br /> accommodate specific requirements concerning product identity and <br /> visual appearance upon request.',
  },
  {
    avatar: 'person3.png',
    description:
      'Presco also boasts impressive engineering capabilities, with CAD, CAM, wire <br /> erosion, and tooling manufacture facilities. This allows them to design and <br /> develop new applications to better serve their customers. They even <br /> accommodate specific requirements concerning product identity and <br /> visual appearance upon request.',
  },
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
            <SwiperSlide>
              <div
                className='text-center rounded-3xl mx-auto p-4'
                style={{
                  width: 500,
                  boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                }}
              >
                <Avatar
                  src={`/fake-image-delete-in-future/${feedback.avatar}`}
                  alt='person'
                  size='large'
                  style={{
                    width: 120,
                    height: 120,
                    border: '2px solid var(--primary-color)',
                    padding: 2,
                  }}
                />
                <div style={{ width: 18 }} className='mx-auto pt-4'>
                  <Image
                    src='/img/feed-back.png'
                    layout='responsive'
                    alt='feedback'
                    width={78}
                    height={78}
                  />
                </div>
                <div
                  style={{ color: '#3A3A3A' }}
                  className='font-thin text-xs pt-4'
                  dangerouslySetInnerHTML={{ __html: feedback.description }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonials;
