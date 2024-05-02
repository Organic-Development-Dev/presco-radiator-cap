import Image from 'next/image';
import { SwiperSlide, Swiper } from 'swiper/react';
import 'swiper/css';

const dataMembers = [
  {
    name: 'Simon Archer',
    position: 'General Manager',
    desc: 'simon@presco-radiator-caps.com',
    image: 'person1.png',
  },
  {
    name: 'Gordon Archer',
    position: 'Technical Manager',
    desc: 'gordon@presco-radiator-caps.com',
    image: 'person2.png',
  },
  {
    name: 'Sue Archer',
    position: 'Company Secretary',
    desc: 'sue@presco-radiator-caps.com',
    image: 'person3.png',
  },
  {
    name: 'Caroline Bird',
    position: 'Adminstration Manager',
    desc: 'sales@presco-radiator-caps.com',
    image: 'person4.png',
  },
  {
    name: 'Sol Griffiths',
    position: 'Quality Engineer',
    desc: 'sol@presco-radiator-caps.com',
    image: 'person5.png',
  },
  {
    name: 'Martin Jelfs',
    position: 'Production Manager',
    desc: '',
    image: 'person6.png',
  },
];

function TeamMembers() {
  return (
    <div className='container mx-auto px-10 py-8'>
      <div className='flex justify-center'>
        <div className='flex gap-2 items-center pb-10'>
          <div style={{ width: 60 }}>
            <Image
              src='/img/team-member.png'
              alt='team-member'
              width={60}
              height={60}
              layout='responsive'
            />
          </div>
          <div
            className='font-bold container mx-auto text-lg'
            style={{ color: 'var(--primary-color)' }}
          >
            TEAM MEMBERS
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-10 hidden sm:grid'>
        {dataMembers.map((member) => (
          <div className='text-center' key={member.name}>
            <div
              style={{ width: 200, borderColor: 'var(--primary-color)' }}
              className='rounded-full p-1 border-4 mx-auto'
            >
              <Image
                src={`/img/${member.image}`}
                layout='responsive'
                alt='person'
                width={250}
                height={250}
              />
            </div>
            <div
              className='uppercase font-semibold pt-4'
              style={{ color: 'var(--primary-color)' }}
            >
              {member.name}
            </div>
            <div className='font-thin' style={{ color: '#3A3A3A' }}>
              {member.position}
            </div>
            <div
              className='font-thin text-xs'
              style={{ color: 'var(--primary-color)' }}
            >
              {member.desc}
            </div>
          </div>
        ))}
      </div>
      <div className='sm:hidden'>
        <Swiper
          style={{ padding: '40px 0' }}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
        >
          {dataMembers.map((member) => (
            <SwiperSlide key={member.name}>
              <div className='text-center'>
                <div
                  style={{ width: 160, borderColor: 'var(--primary-color)' }}
                  className='rounded-full p-1 border-4 mx-auto'
                >
                  <Image
                    src={`/img/${member.image}`}
                    layout='responsive'
                    alt='person'
                    width={250}
                    height={250}
                  />
                </div>
                <div
                  className='uppercase font-semibold pt-4'
                  style={{ color: 'var(--primary-color)' }}
                >
                  {member.name}
                </div>
                <div className='font-thin' style={{ color: '#3A3A3A' }}>
                  {member.position}
                </div>
                <div
                  className='font-thin text-xs'
                  style={{ color: 'var(--primary-color)' }}
                >
                  {member.desc}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default TeamMembers;
