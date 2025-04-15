import { Divider } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import GET_PAGE_BY_ID from '../../queries/get-page-by-title';
import client from '../ApolloClient';
import { useRouter } from 'next/router';

// Product data
const dataProducts = [
  {
    name: 'auto europe',
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
  const router = useRouter();
  
  // Navigation handler
  const handleNavigation = (url) => {
    router.push(url);
  };
  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.query({
          query: GET_PAGE_BY_ID,
          variables: { id: 'cG9zdDo2OTEx' },
        });
        setData(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
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
            <div className='text-center' style={{
              padding: '15px 10px',
              margin: '0 0 20px 0',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              maxWidth: '100%'
            }}>
              {/* Image - made clickable */}
              <div
                onClick={() => handleNavigation(product.href)}
                style={{
                  width: product.width ?? 150,
                  height: 140,
                  margin: '0 auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '3px solid transparent',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#A11A36';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={`/img/${product.image}`}
                  alt={product.name}
                  width={180}
                  height={150}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              </div>
              
              {/* Title - made clickable */}
              <div
                onClick={() => handleNavigation(product.href)}
                className='font-extrabold text-xl py-4 uppercase'
                style={{
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#d23651'} 
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
              >
                {product.name}
              </div>
              
              {/* Description */}
              <div
                style={{ color: '#3A3A3A' }}
                className='text-xs pb-4'
                dangerouslySetInnerHTML={{ __html: product.desc }}
              />
              
              {/* Button - made more prominent */}
              <div className='action-button'>
                <button
                  onClick={() => handleNavigation(product.href)}
                  className='rounded-full text-white text-xs'
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#d23651';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
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
      {data?.page?.content && (
        <div dangerouslySetInnerHTML={{ __html: data.page.content }} />
      )}
    </div>
  );
}

export default OurProducts;