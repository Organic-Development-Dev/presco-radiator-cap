import Image from 'next/image';

const dataCores = [
  {
    name: 'QUALITY',
      image: 'quality.png',
    desc: '',
    subDesc: '',
  },
  {
    name: 'SERVICE',
      image: 'service.png',
    desc: '',
    subDesc: '',
  },
  {
    name: 'INNOVATION',
      image: 'innovation.png',
    desc: '',
    subDesc: '',
  },
];

function CoreValue({ title = 'CORE VALUES' }) {
  return (
    <div className='container mx-auto text-center bg-white px-10 py-8 text-lg'>
      <div
        className='font-bold pb-10 text-lg'
        style={{ color: 'var(--primary-color)' }}
      >
        {title}
      </div>
      <div className='core-value-items flex flex-col sm:flex-row items-center justify-between'>
        {dataCores.map((coreItem) => (
          <div key={coreItem.name} className='text-center pb-8 sm:p-0'>
            <div
              style={{
                width: 114,
                height: 114,
              }}
              className='rounded-full m-auto'
            >
              <Image
                src={`/img/${coreItem.image}`}
                alt='core-image'
                layout='responsive'
                width={130}
                height={130}
              />
            </div>
            <div
              className='font-extrabold text-xl py-4'
              style={{ color: 'var(--primary-color)' }}
            >
              {coreItem.name}
            </div>
            <div
              className='font-semibold italic pb-4'
              style={{ color: 'var(--primary-color)' }}
              dangerouslySetInnerHTML={{ __html: coreItem.desc }}
            />
            <div
              style={{ color: '#3A3A3A' }}
              className='text-xs'
              dangerouslySetInnerHTML={{ __html: coreItem.subDesc }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoreValue;
