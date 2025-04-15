import { Col, Row } from "antd";
import { Facebook, Instagram, Tiktok, Twitter, Youtube } from "./icons";
import Link from "next/link";
import Image from "next/image";
import SvgFacebook from "./icons/Facebook";
import SvgTwitter from "./icons/Twitter";
import SvgInstagram from "./icons/Instagram";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  return (
    <div className="footer text-white font-thin cursor-pointer">
      <div style={{ backgroundColor: "#4C4C4C" }}>
        <div className="container w-5/6 sm:w-full m-auto py-10 px-6 sm:px-0">
          <Row gutter={16}>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <div className="pb-8">
                <div className="md:w-48 lg:w-64">
                  <Image
                    src="/img/logo-bg-white.png"
                    width={240}
                    height={72}
                    style={{ width: '100%', height: 'auto' }}
                    alt="Presco Radiator Caps Logo"
                    priority
                  />
                </div>
                <div className="md:w-64 flex gap-8 justify-between sm:justify-start mt-4">
                  <a href="/">
                    <SvgFacebook />
                  </a>
                  <a href="/">
                    <SvgTwitter />
                  </a>
                  <a href="/">
                    <SvgInstagram />
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <Row gutter={16}>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className="pb-8 text-xs">
                    <div className="font-semibold text-white text-sm mb-4">
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
                    <div className="underline">Ph: +44 (0)1905 755656</div>
                    <div className="underline">Fax: +44 (0)1905755654</div>
                    <div className="underline">
                      sales@presco-radiator-caps.com
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className="pb-8 text-xs">
                    <div className="font-semibold text-white text-sm mb-4">
                      OUR PRODUCT
                    </div>
                    <div>
                      <Link href='/product-category/auto'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Europe Auto</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/product-category/japanese-caps'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Japanese Auto</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/product-category/agricultural'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Agricultural</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/product-category/commercial-caps'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Trucks & Commercials</a>
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className="text-xs">
                    <div className="font-semibold text-white text-sm mb-4">
                      IMPORTANT LINKS
                    </div>
                    <div>
                      <Link href='/packaging'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Packaging</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/inspection-testing'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Inspection & Testing</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/about-us'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>About Us</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/news'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Blog</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/contact-us'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Contact Us</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/privacy-policy'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Privacy Policy</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/terms-and-conditions'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Terms and Conditions</a>
                      </Link>
                    </div>
                    <div>
                      <Link href='/disclaimer'>
                        <a style={{display: 'block', padding: '8px 0', minHeight: '36px'}}>Disclaimer</a>
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <div
        className="text-white p-4 text-center font-thin text-xs"
        style={{ backgroundColor: "#333333" }}
      >
        Copyright © presco-radiator-caps.com 2010-2025. All Rights Reserved
      </div>
    </div>
  );
};

export default Footer;

