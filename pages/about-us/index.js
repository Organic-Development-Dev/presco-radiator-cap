import { Breadcrumb, Col, Image, Row } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const content =
  'Presco is certified to the standard & guidelines of ISO 9001:2015. <br /> See our current certification. <br /> Our Pnuetek FC0750 Pressure & Leak Testing Machine uses state of <br /> the art testing equipment to measure both the radiator cap <br /> pressure & valve leak to 100th of one PSI.We have a second <br /> electronic pressure testing machine, our J.M.Bodley tester, with a <br /> comprehensive range of compatible test pots, for our range of <br /> expansion tank pressure caps.Presco follows extensive testing <br /> procedures for all its clients, and for some, all radiator caps are <br /> 100% pressure and leak tested. <br /> Presco has recently introduced a new water testing facility, for <br /> further extensive testing of our metal & expansion tank caps.';

function Index({ data }) {
  return (
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
  );
}

export default Index;

export async function getStaticProps(context) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const { data } = await axios.get(
        `${apiBaseUrl}/api/pages/1195`
    );
  if (data) {
    return {
      props: {
        data,
      },
    };
  }
}
