import { Breadcrumb } from 'antd';
import axios from 'axios';
function Index({ data }) {
  return (
      <>
    <div id='about-us'>
      <div style={{ backgroundColor: '#F6F6F6' }}>
        <div className='container mx-auto py-4'>
          <Breadcrumb
            style={{ color: 'var(--primary-color)' }}
            items={[
              {
                title: 'Home',
              },
              {
                title: 'About Us',
              },
            ]}
          />
        </div>
      </div>
        <div className='cms-content container mx-auto py-16'>
            <div dangerouslySetInnerHTML={{__html: data?.content?.rendered}}/>
        </div>
    </div>
      </>
  );
}

export default Index;

export async function getStaticProps(context) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const { data } = await axios.get(`${apiBaseUrl}/api/pages/1195`);
        return {
            props: {
                data,
            },
            revalidate: 1,
        };
    } catch (error) {
        console.error('Error fetching data in getStaticProps', error);
        return {
            props: {
                data: null,
            },
            revalidate: 1,
        };
    }
}
