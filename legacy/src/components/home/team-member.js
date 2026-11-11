import Image from 'next/image';
import { useState, useEffect } from 'react';

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
        {/* Simple mobile carousel */}
        <MobileCarousel members={dataMembers} />
      </div>
    </div>
  );
}

// Simple mobile carousel component
function MobileCarousel({ members }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % members.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [members.length]);
  
  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative px-4">
      {/* Current slide */}
      <div className="text-center py-4">
        <div
          style={{ width: 160, borderColor: 'var(--primary-color)' }}
          className="rounded-full p-1 border-4 mx-auto"
        >
          <Image
            src={`/img/${members[currentSlide].image}`}
            alt={members[currentSlide].name}
            width={250}
            height={250}
          />
        </div>
        <div
          className="uppercase font-semibold pt-4"
          style={{ color: 'var(--primary-color)' }}
        >
          {members[currentSlide].name}
        </div>
        <div className="font-thin" style={{ color: '#3A3A3A' }}>
          {members[currentSlide].position}
        </div>
        <div
          className="font-thin text-xs"
          style={{ color: 'var(--primary-color)' }}
        >
          {members[currentSlide].desc}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 gap-2">
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${
              currentSlide === index ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TeamMembers;
