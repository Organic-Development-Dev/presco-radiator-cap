import { Breadcrumb, Button, Col, Row } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import GET_BLOGS from '../../src/queries/get-blogs';
import client from '../../src/components/ApolloClient';

const des =
  'Presco is certified to the standard & guidelines of ISO 9001:2015. See our current certification. Our Pnuetek FC0750 Pressure & Leak Testing Machine uses state of the art testing equipment to measure both the radiator cap pressure & valve leak to 100th of one PSI.We have a second electronic pressure testing machine, our J.M.Bodley tester, with a comprehensive range of compatible test pots, for our range of expansion tank pressure caps.Presco follows extensive testing procedures for all its clients, and for some, all radiator caps are 100% pressure and leak tested. Presco has recently introduced a new water testing facility, for further extensive testing of our metal & expansion tank caps. Using these machines Presco is able to provide the customer with detailed testing results so they may be confident that the supplied product is of perfect quality.This will be achieved through continued improvement and investment in new technology, machinery, training and at all times following the policies set down and procedures laid out in our quality manual and in accordance with the ANSI SAE J164 international standards.';

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
                title: 'Resources',
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
                    src='/img/background-gray.png'
                    layout='responsive'
                    width={361}
                    height={207}
                    objectFit='contain'
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
