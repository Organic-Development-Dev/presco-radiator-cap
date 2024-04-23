import { Breadcrumb, Button, Col, Form, Image, Input, Row } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import GalleryCarousel from '../../src/components/single-product/gallery-carousel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const router = useRouter();

  console.log(product);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ backgroundColor: '#F6F6F6' }}>
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
              <Swiper
                style={{
                  '--swiper-navigation-color': 'var(--primary-color)',
                  '--swiper-pagination-color': 'var(--primary-color)',
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className='mySwiper2'
              >
                {product.images.map((product) => (
                  <SwiperSlide key={product.id}>
                    {product.src && (
                      <Image
                        src={product.src}
                        alt='product'
                        className='rounded-lg'
                        width='100%'
                        height='100%'
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className='mySwiper'
              >
                {product.images.map((product) => (
                  <SwiperSlide key={product.id}>
                    {product.src && (
                      <Image
                        src={product.src}
                        alt='product'
                        className='rounded-lg'
                        width='100%'
                        height={120}
                        preview={false}
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
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
                {product.images[0]?.src && (
                  <Image
                    src={product.images[0].src}
                    alt='product'
                    className='rounded-lg'
                    width={120}
                    height={120}
                    preview={false}
                  />
                )}
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
            <Swiper slidesPerView={3} spaceBetween={30} loop={true}>
              {relatedProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div
                    className='rounded-xl flex flex-col items-center'
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <Image
                      src={product.images[0]?.src ?? '/img/background-gray.png'}
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
                </SwiperSlide>
              ))}
            </Swiper>
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
