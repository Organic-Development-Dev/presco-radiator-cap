import { Divider } from 'antd';
import Image from 'next/image';

const dataProducts = [
  {
    name: 'auto eUrope',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'core-image.png',
  },
  {
    name: 'japanese auto',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'product2.png',
    width: 190,
    height: 154,
  },
  {
    name: 'AGRICULTURAL',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'product3.png',
  },
  {
    name: 'AGRICULTURAL',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'product4.png',
  },
];

function OurProducts() {
  return (
    <div className='text-center py-8' style={{ backgroundColor: '#ECECEC' }}>
      <div
        className='font-bold container mx-auto text-lg'
        style={{ color: 'var(--primary-color)' }}
      >
        OUR PRODUCTS
      </div>
      <div className='container mx-auto flex flex-col sm:flex-row items-center justify-evenly py-8'>
        {dataProducts.map((product, id) => (
          <>
            <div key={product.name} className='text-center'>
              <div
                style={{ width: product.width ?? 150 }}
                className='rounded-full mx-auto'
              >
                <Image
                  src={`/img/${product.image}`}
                  alt='product'
                  layout='responsive'
                  width={product.width ?? 180}
                  height={product.height ?? 150}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div
                className='font-extrabold text-xl py-4 uppercase'
                style={{ color: 'var(--primary-color)' }}
              >
                {product.name}
              </div>
              <div
                style={{ color: '#3A3A3A' }}
                className='text-xs pb-4'
                dangerouslySetInnerHTML={{ __html: product.desc }}
              />
              <div>
                <button
                  className='rounded-full px-2 py-1 text-white text-xs'
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  View More
                </button>
              </div>
            </div>

            {id < 3 && (
              <Divider
                type='vertical'
                style={{ backgroundColor: '#000', height: 110 }}
                className='hidden sm:block'
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default OurProducts;
