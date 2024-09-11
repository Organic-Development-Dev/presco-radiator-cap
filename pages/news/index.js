import { Breadcrumb, Button, Col, Row } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import GET_BLOGS from '../../src/queries/get-blogs';
import client from '../../src/components/ApolloClient';
import {DEFAULT_PRODUCT_HOME_IMG_URL} from "../../src/constants/urls";

const des = '';

  
function Index(props) {
  const router = useRouter();
  const { blogs } = props;
  // console.log(blogs);
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
                title: 'News',
              },
            ]}
          />
        </div>
      </div>
      <div
        className='container mx-auto py-4 sm:py-16'
        style={{ color: '#3a3a3a' }}
      >
        <div className='flex sm:gap-4'>
          <div style={{ minWidth: 150 }} className='hidden sm:block'>
            <Image
              src='/img/logo-bg-white.png'
              alt='logo'
              width={240}
              height={60}
              layout='responsive'
              objectFit='cover'
            />
          </div>
          <div
            className='font-thin text-justify sm:text-left text-xs'
            dangerouslySetInnerHTML={{ __html: des }}
          />
        </div>
        <div className='py-8'>
          {blogs.map((blog) => (
            <div key={blog.title} className='mb-10 sm:mb-12'>
              <Row
                gutter={16}
                key={blog.title}
                onClick={() => router.push(`/blog/${blog?.slug}`)}
                className='cursor-pointer'
              >
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Image
                    src={
                        blog?.featuredImage?.node?.mediaItemUrl ?? '/img/background-gray.png'
                    }
                    layout='responsive'
                    className='blog-image'
                    width={361}
                    height={207}
                    objectFit='cover'
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 16 }}>
                  <div>
                    <div
                      style={{ color: 'var(--primary-color)' }}
                      className='font-extrabold text-xl uppercase'
                    >
                      {blog?.title}
                    </div>
                    <div
                      className='line-clamp-3 font-thin text-xs'
                      style={{ maxHeight: '54px', overflow: 'hidden' }}
                      dangerouslySetInnerHTML={{ __html: blog?.content }}
                    />
                    <div className='mt-2'>
                      <button
                        style={{ backgroundColor: 'var(--primary-color)' }}
                        className='rounded-xl font-thin text-white px-2 py-1 text-xs'
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Index;

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_BLOGS,
  });

  return {
    props: {
      blogs: data?.posts?.nodes || [],
    },
  };
}
