import { Breadcrumb, Button, Col, Form, Image, Input, Row } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import { DEFAULT_PRODUCT_HOME_IMG_URL } from '../../src/constants/urls';
import Head from 'next/head';

const ModalEnquireNow = dynamic(
  () => import('../../src/components/ModalEnquireNow'),
  {
    ssr: false,
  }
);

function Index(props) {
  const { product, relatedProducts } = props;
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentRelatedSlide, setCurrentRelatedSlide] = useState(0);
  const router = useRouter();

  console.log(product);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta
            title={product.name}
            content={product.name}
        />
        <meta name="description" content={product?.yoast_head_json?.og_description ?? 'Presco Radiator Caps'}/>
        <meta property="og:locale" content={product?.yoast_head_json?.og_locale}/>
        <meta property="og:site_name" content={product?.yoast_head_json?.og_site_name}/>
        <meta property="og:url" content="https://www.presco-radiator-caps.com"/>
        <meta property="og:title" content={product?.yoast_head_json?.og_title}/>
        <meta property="og:type" content={product?.yoast_head_json?.og_type}/>
        <meta property="og:description" content={product?.yoast_head_json?.og_description}/>
      </Head>
      <div style={{backgroundColor: '#F6F6F6'}}>
        <div className='container mx-auto py-4'>
          <Breadcrumb
            style={{ color: 'var(--primary-color)' }}
            items={[
              {
                title: 'Home',
              },
              {
                title: 'Product',
              },
              {
                title: product.name,
              },
            ]}
          />
        </div>
      </div>
      <div className='container mx-auto py-12'>
        <div className='w-5/6 mx-auto'>
          <Row gutter={80}>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              {/* Main image display */}
              <div className="mb-4">
                {product.images[currentImage]?.src && (
                  <Image
                    src={product.images[currentImage].src}
                    alt={product.name}
                    className="rounded-lg"
                    width="100%"
                    height="100%"
                  />
                )}
              </div>
              
              {/* Thumbnail navigation */}
              <div className="flex flex-wrap gap-2 justify-center">
                {product.images.map((img, index) => (
                  <div 
                    key={img.id}
                    className={`cursor-pointer transition-all duration-200 ${currentImage === index ? 'border-2 border-primary' : 'border border-gray-300'}`}
                    onClick={() => setCurrentImage(index)}
                  >
                    {img.src && (
                      <Image
                        src={img.src}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="rounded-lg"
                        width={80}
                        height={80}
                        preview={false}
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <div
                className='font-semibold text-xl pb-8'
                style={{ color: 'var(--primary-color)' }}
              >
                {product.name}
              </div>
              {product.attributes.map((att) => (
                <div className='pb-4' key={att.name}>
                  <span
                    className='uppercase text-lg'
                    style={{ color: 'var(--primary-color)' }}
                  >
                    {att.name}
                  </span>
                  <div
                    className='font-thin text-xs'
                    dangerouslySetInnerHTML={{
                      __html: att.options.toString(),
                    }}
                  />
                </div>
              ))}
              <div className='flex gap-4'>
                <Button
                  className='rounded-lg py-2 px-4 text-white flex items-center'
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  onClick={() => {
                    setTypeModal(1);
                    setOpenModal(true);
                  }}
                >
                  Enquire Now
                </Button>
                <Button
                  className='rounded-lg py-2 px-4 text-white flex items-center'
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  onClick={() => {
                    setTypeModal(2);
                    setOpenModal(true);
                  }}
                >
                  Order Now
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className='text-center pt-16'>
          <div
            className='uppercase text-xl font-semibold'
            style={{ color: 'var(--primary-color)' }}
          >
            Related products
          </div>
          <div className='hidden sm:flex justify-between mt-4 w-5/6 mx-auto'>
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className='rounded-xl flex flex-col'
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  src={product.images[0]?.src ?? DEFAULT_PRODUCT_HOME_IMG_URL}
                  alt='product'
                  className='rounded-lg'
                  width={120}
                  height={120}
                  preview={false}
                />
                <div
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className='py-1 px-4 rounded-lg text-white inline-block text-xs mt-4 cursor-pointer inline-block'
                >
                  {product?.name}
                </div>
              </div>
            ))}
          </div>
          <div className='sm:hidden pt-8'>
            {/* Mobile related products carousel */}
            <div className="relative px-4">
              {/* Show only 3 visible slides at a time on mobile */}
              <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                {relatedProducts.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className='rounded-xl flex-shrink-0 flex flex-col items-center'
                    style={{ width: '100px' }}
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <Image
                      src={
                        product.images[0]?.src ?? DEFAULT_PRODUCT_HOME_IMG_URL
                      }
                      alt='product'
                      className='rounded-lg'
                      width={100}
                      height={100}
                      preview={false}
                    />
                    <div
                      style={{ backgroundColor: 'var(--primary-color)' }}
                      className='py-1 px-4 rounded-lg text-white inline-block text-xs mt-4 cursor-pointer inline-block'
                    >
                      {product?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalEnquireNow
        type={typeModal}
        open={openModal}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}

export default Index;

export async function getStaticProps(context) {
  const {
    params: { id },
  } = context;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiBaseUrl}/api/product/${id}`);
  const product = await response.json();
  let relatedProducts = [];

  if (product.related_ids.length > 0) {
    const dataRelatedRes = await fetch(
      `${apiBaseUrl}/api/products?include=${product.related_ids.toString()}`
    );
    relatedProducts = await dataRelatedRes.json();
  }

  return {
    props: {
      product,
      relatedProducts,
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
