import { Col, Row } from 'antd';
import { Facebook, Instagram, Tiktok, Twitter, Youtube } from './icons';
import Link from 'next/link';
import Image from 'next/image';
import SvgFacebook from './icons/Facebook';
import SvgTwitter from './icons/Twitter';
import SvgInstagram from './icons/Instagram';

const Footer = () => (
  <div className='footer text-white font-thin'>
    <div style={{ backgroundColor: '#4C4C4C' }}>
      <div className='container m-auto py-10 px-6 sm:px-0'>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <div className='pb-8'>
              <div style={{ width: 240 }}>
                <Link href='/'>
                  <Image
                    src='/img/logo-bg-white.png'
                    layout='responsive'
                    width={240}
                    height={72}
                    alt='logo'
                  />
                </Link>
              </div>
              <div
                style={{ width: 240 }}
                className='flex gap-8 justify-between sm:justify-start mt-4'
              >
                <Link href='/'>
                  <SvgFacebook />
                </Link>
                <Link href='/'>
                  <SvgTwitter />
                </Link>
                <Link href='/'>
                  <SvgInstagram />
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 16 }}>
            <Row gutter={16}>
              <Col xs={{ span: 24 }} lg={{ span: 8 }}>
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
              <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                <div className='pb-8 text-xs'>
                  <div className='font-semibold text-white text-sm mb-4'>
                    OUR PRODUCT
                  </div>
                  <div>Europe Auto</div>
                  <div>Japanese Auto</div>
                  <div>Agricultural</div>
                  <div>Trucks & Commercials</div>
                </div>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                <div className='text-xs'>
                  <div className='font-semibold text-white text-sm mb-4'>
                    IMPORTANT LINKS
                  </div>
                  <div>Packaging</div>
                  <div>Inspection & Testing</div>
                  <div>About Us</div>
                  <div>Blog</div>
                  <div>Contact Us</div>
                  <div>Privacy Policy</div>
                  <div>Disclaimer</div>
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

export default Footer;
