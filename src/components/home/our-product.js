import { Divider } from 'antd';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import GET_PAGE_BY_ID from '../../queries/get-page-by-title';
import client from '../ApolloClient';

const dataProducts = [
  {
    name: 'auto eUrope',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'core-image.png',
    href: '/product-category/auto/',
  },
  {
    name: 'japanese auto',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'product2.png',
    width: 190,
    height: 154,
    href: '/product-category/japanese-caps/',
  },
  {
    name: 'AGRICULTURAL',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'product3.png',
    href: '/product-category/agricultural/',
  },
  {
    name: 'Trucks & Commercial',
    desc:
      'Presco Radiator Caps Ltd is <br /> committed to industry-leading <br /> coverage in every product <br /> category we bring to market.',
    image: 'product4.png',
    href: '/product-category/commercial-caps/',
  },
];

function OurProducts() {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await client.query({
        query: GET_PAGE_BY_ID,
        variables: { id: 'cG9zdDo2OTEx' },
      });
      setData(data);
    })();
  }, []);

  return (
    <div className='text-center py-8' style={{ backgroundColor: '#ECECEC' }}>
      <div
        className='font-bold container mx-auto text-lg'
        style={{ color: 'var(--primary-color)' }}
      >
        OUR PRODUCTS
      </div>
      <div className='container mx-auto flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-evenly py-8'>
        {dataProducts.map((product, id) => (
          <Fragment key={product.name}>
            <div className='text-center'>
              <div
                style={{ width: product.width ?? 150, height: 140 }}
                className='rounded-full mx-auto cursor-pointer'
                onClick={() => window.location.href = product.href}
              >
                <img
                  src={`/img/${product.image}`}
                  alt={product.name}
                  width={180}
                  height={150}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div
                className='font-extrabold text-xl py-4 uppercase cursor-pointer'
                style={{ color: 'var(--primary-color)' }}
                onClick={() => window.location.href = product.href}
              >
                {product.name}
              </div>
              <div
                style={{ color: '#3A3A3A' }}
                className='text-xs pb-4'
                dangerouslySetInnerHTML={{ __html: product.desc }}
              />
              <div className='action-button'>
                <button
                  onClick={() => window.location.href = product.href}
                  className='rounded-full px-4 py-2 text-white text-xs'
                  style={{ backgroundColor: 'var(--primary-color)', cursor: 'pointer' }}
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
          </Fragment>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: data?.page.content }} />
    </div>
  );
}

export default OurProducts;
