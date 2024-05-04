import { Col, Row } from 'antd';
import { Facebook, Instagram, Tiktok, Twitter, Youtube } from './icons';
import Link from 'next/link';
import Image from 'next/image';
import SvgFacebook from './icons/Facebook';
import SvgTwitter from './icons/Twitter';
import SvgInstagram from './icons/Instagram';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();
  return (
    <div className='footer text-white font-thin cursor-pointer'>
      <div style={{ backgroundColor: '#4C4C4C' }}>
        <div className='container w-5/6 sm:w-full m-auto py-10 px-6 sm:px-0'>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <div className='pb-8'>
                <div className='md:w-48 lg:w-64'>
                  <Image
                    src='/img/logo-bg-white.png'
                    layout='responsive'
                    width={240}
                    height={72}
                    alt='logo'
                  />
                </div>
                <div className='md:w-64 flex gap-8 justify-between sm:justify-start mt-4'>
                  <a href='/'>
                    <SvgFacebook />
                  </a>
                  <a href='/'>
                    <SvgTwitter />
                  </a>
                  <a href='/'>
                    <SvgInstagram />
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <Row gutter={16}>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className='pb-8 text-xs'>
                    <div className='font-semibold text-white text-sm mb-4'>
                      OUR ADDRESS
                    </div>
                    <div>
                      Presco Radiator Caps Ltd.
                      <br />
                      Unit D86, Blackpole Trading Estate
                      <br />
                      West, Worcester, England, WR3 8TJ
                    </div>
                    <br />
                    <div className='underline'>Ph: +44 (0)1905 755656</div>
                    <div className='underline'>Fax: +44 (0)1905755654</div>
                    <div className='underline'>
                      sales@presco-radiator-caps.com
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className='pb-8 text-xs'>
                    <div className='font-semibold text-white text-sm mb-4'>
                      OUR PRODUCT
                    </div>
                    <div onClick={() => router.push('/products')}>
                      Europe Auto
                    </div>
                    <div onClick={() => router.push('/products')}>
                      Japanese Auto
                    </div>
                    <div onClick={() => router.push('/products')}>
                      Agricultural
                    </div>
                    <div onClick={() => router.push('/products')}>
                      Trucks & Commercials
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className='text-xs'>
                    <div className='font-semibold text-white text-sm mb-4'>
                      IMPORTANT LINKS
                    </div>
                    <div>Packaging</div>
                    <div onClick={() => router.push('/inspection-testing')}>
                      Inspection & Testing
                    </div>
                    {/* <div onClick={() => router.push("/about-us")}>About Us</div>
                    <div onClick={() => router.push("/news")}>Blog</div>
                    <div onClick={() => router.push("/contact-us")}>
                      Contact Us
                    </div> */}
                    <div onClick={() => router.push('/privacy-policy')}>
                      Privacy Policy
                    </div>
                    <div onClick={() => router.push('/disclaimer')}>
                      Disclaimer
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <div
        className='text-white p-4 text-center font-thin text-xs'
        style={{ backgroundColor: '#333333' }}
      >
        Copyright © presco-radiator-caps.com 2010-2024. All Rights Reserved
      </div>
    </div>
  );
};

export default Footer;
