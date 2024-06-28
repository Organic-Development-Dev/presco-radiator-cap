import { Breadcrumb } from 'antd';
import axios from 'axios';
import Head from "next/head";
function Index({ data }) {
  return (
      <>
          <Head>
              <title>{data?.yoast_head_json?.title}</title>
              <meta content={data?.yoast_head_json?.og_title}/>
              <meta name="description" content={data?.yoast_head_json?.og_description ?? 'Presco Radiator Caps'}/>
              <meta property="og:locale" content={data?.yoast_head_json?.og_locale}/>
              <meta property="og:site_name" content={data?.yoast_head_json?.og_site_name}/>
              <meta property="og:url" content="https://www.presco-radiator-caps.com"/>
              <meta property="og:title" content={data?.yoast_head_json?.og_title}/>
              <meta property="og:type" content={data?.yoast_head_json?.og_type}/>
              <meta property="og:description" content={data?.yoast_head_json?.og_description}/>
          </Head>
          <div id='about-us'>
              <div style={{backgroundColor: '#F6F6F6'}}>
                  <div className='container mx-auto py-4'>
                  <Breadcrumb
                          style={{color: 'var(--primary-color)'}}
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
