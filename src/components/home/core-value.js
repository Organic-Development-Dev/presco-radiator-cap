import Image from 'next/image';

const dataCores = [
  {
    name: 'QUALITY',
    desc: 'WISH YOU COULD SAY YES <br /> MORE OFTEN?',
    subDesc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br />category we bring to market.',
  },
  {
    name: 'SERVICE',
    desc: 'STRUGGLING WIT <br /> FILL RATES & CATEGORY <br /> MANAGEMENT?',
    subDesc:
      'Presco Radiator Caps fill rate average of 97.81%* <br/> and category management <br /> expertise will ensure your shelves are stocked with <br /> the right parts for optimal product availability.',
  },
  {
    name: 'INNOVATION',
    desc: 'LOOKING FOR INNOVATIVE <br /> UP-SELL OPPORTUNITIES?',
    subDesc:
      'Presco’s product and engineering teams are <br /> in tune with market issues, providing <br/> innovative OEM+ product solutions.',
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
      <div className='flex flex-col sm:flex-row items-center justify-between'>
        {dataCores.map((coreItem) => (
          <div key={coreItem.name} className='text-center pb-8 sm:p-0'>
            <div
              style={{
                width: 114,
                height: 114,
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              }}
              className='rounded-full m-auto'
            >
              <Image
                src='/img/core-image.png'
                alt='core-image'
                layout='responsive'
                width={130}
                height={120}
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
