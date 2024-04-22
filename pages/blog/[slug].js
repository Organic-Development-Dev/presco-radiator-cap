import { Breadcrumb } from 'antd';
import Image from 'next/image';
import { Image as ImageAntd } from 'antd';
import client from '../../src/components/ApolloClient';
import GET_DETAIL_BLOG from '../../src/queries/get-detail-blog';

function Index(props) {
  const { post } = props;
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
                title: 'Blog',
              },
            ]}
          />
        </div>
      </div>
      <div className='container mx-auto py-16'>
        <div
          className='font-extrabold text-xl relative mb-2 text-center'
          style={{ color: 'var(--primary-color)' }}
        >
          {post.title}
        </div>
        <div style={{ width: 20 }} className='mx-auto'>
          <Image
            src='/img/feed-back.png'
            layout='responsive'
            alt='feedback'
            width={78}
            height={78}
          />
        </div>
        <div className='w-5/6 sm:w-2/3 mx-auto'>
          <div
            className='font-thin mx-auto text-justify capitalize leading-7 text-xs pt-8'
            style={{ color: '#3A3A3A' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {/* <div className='flex gap-2 items-center pt-8'>
            <ImageAntd
              src='/img/person.png'
              alt='person'
              width={80}
              height={80}
              className='rounded-full'
              style={{ border: '2px solid var(--primary-color)', padding: 1 }}
            />
            <div>{post.author.name}</div>
          </div> */}
          <div className='flex flex-col sm:flex-row justify-between pt-8'>
            <div>
              <div className='font-thin' style={{ color: '#3A3A3A' }}>
                Previous Post
              </div>
              <div
                className='font-semibold text-lg'
                style={{ color: 'var(--primary-color)' }}
              >
                Why not? I always choose the hard way for me
              </div>
            </div>
            <div>
              <div
                className='font-thin text-left pt-4 sm:pt-0 sm:text-right'
                style={{ color: '#3A3A3A' }}
              >
                Next Post
              </div>
              <div
                className='font-semibold text-lg text-left sm:text-right'
                style={{ color: 'var(--primary-color)' }}
              >
                Why not? I always choose the hard way for me
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;

export async function getStaticProps(context) {
  const {
    params: { slug },
  } = context;

  const { data } = await client.query({
    query: GET_DETAIL_BLOG,
    variables: { slug },
  });
  return {
    props: {
      post: {
        content: data?.post?.content,
        title: data?.post?.title,
        author: data?.post.author?.node,
      },
    },
    revalidate: 1,
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
