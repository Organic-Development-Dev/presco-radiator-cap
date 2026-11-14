import { Col, Row } from "antd";
import SvgFacebook from "./icons/Facebook";
import SvgTwitter from "./icons/Twitter";
import SvgInstagram from "./icons/Instagram";
import Image from "next/image";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  
  // Direct navigation handler
  const handleNavigate = (url) => {
    router.push(url);
  };

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
                  <div 
                    onClick={() => window.open('https://facebook.com', '_blank')}
                    style={{ minHeight: '36px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <SvgFacebook />
                  </div>
                  <div 
                    onClick={() => window.open('https://twitter.com', '_blank')}
                    style={{ minHeight: '36px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <SvgTwitter />
                  </div>
                  <div 
                    onClick={() => window.open('https://instagram.com', '_blank')}
                    style={{ minHeight: '36px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <SvgInstagram />
                  </div>
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
                      <div onClick={() => handleNavigate('/product-category/auto')} 
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Europe Auto
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/product-category/japanese-caps')} 
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Japanese Auto
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/product-category/agricultural')} 
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Agricultural
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/product-category/commercial-caps')} 
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Trucks & Commercials
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <div className="text-xs">
                    <div className="font-semibold text-white text-sm mb-4">
                      IMPORTANT LINKS
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/packaging')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Packaging
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/inspection-testing')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Inspection & Testing
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/about-us')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        About Us
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/news')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Blog
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/contact-us')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Contact Us
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/privacy-policy')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Privacy Policy
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/terms-and-conditions')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Terms and Conditions
                      </div>
                    </div>
                    <div>
                      <div onClick={() => handleNavigate('/disclaimer')}
                           style={{display: 'block', padding: '8px 0', minHeight: '36px', cursor: 'pointer'}}>
                        Disclaimer
                      </div>
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