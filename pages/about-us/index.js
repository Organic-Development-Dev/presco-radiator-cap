import { Breadcrumb, Col, Image, Row } from 'antd';
import TeamMembers from '../../src/components/home/team-member';
import Subscriber from '../../src/components/home/subscriber';

const content =
  'Presco is certified to the standard & guidelines of ISO 9001:2015. <br /> See our current certification. <br /> Our Pnuetek FC0750 Pressure & Leak Testing Machine uses state of <br /> the art testing equipment to measure both the radiator cap <br /> pressure & valve leak to 100th of one PSI.We have a second <br /> electronic pressure testing machine, our J.M.Bodley tester, with a <br /> comprehensive range of compatible test pots, for our range of <br /> expansion tank pressure caps.Presco follows extensive testing <br /> procedures for all its clients, and for some, all radiator caps are <br /> 100% pressure and leak tested. <br /> Presco has recently introduced a new water testing facility, for <br /> further extensive testing of our metal & expansion tank caps.';

function Index() {
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
      <div className='container mx-auto py-16'>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Image
              src='/img/background-gray.png'
              layout='responsive'
              width={480}
              height={357}
              objectFit='contain'
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <div>
              <div
                className='font-extrabold text-xl relative mb-2'
                style={{ color: 'var(--primary-color)' }}
              >
                OUR STORY
                <div
                  style={{
                    width: 80,
                    height: 2,
                    backgroundColor: 'var(--primary-color)',
                  }}
                  className='absolute bottom-2 left-0'
                />
              </div>
              <div
                style={{ color: '#3A3A3A' }}
                className='text-lg font-thin'
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className='our-service py-16'>
        <div className='container mx-auto'>
          <div
            className='font-extrabold text-xl relative mb-2 text-center'
            style={{ color: 'var(--primary-color)' }}
          >
            Our Services
            <div
              style={{
                width: 80,
                height: 2,
                backgroundColor: 'var(--primary-color)',
                position: 'absolute',
                left: '50%',
                bottom: '-4px',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
          <div className='w-9/12 mx-auto flex justify-between py-8'>
            <div className='text-center'>
              <Image
                src='/fake-image-delete-in-future/person.png'
                alt='person'
                width={110}
                height={110}
                className='rounded-full'
              />
              <div
                style={{ color: 'var(--primary-color)' }}
                className='pt-4 uppercase font-extrabold text-lg'
              >
                Your title
              </div>
            </div>
            <div className='text-center'>
              <Image
                src='/fake-image-delete-in-future/person.png'
                alt='person'
                width={110}
                height={110}
                className='rounded-full'
              />
              <div
                style={{ color: 'var(--primary-color)' }}
                className='pt-4 uppercase font-extrabold text-lg'
              >
                Your title
              </div>
            </div>
            <div className='text-center'>
              <Image
                src='/fake-image-delete-in-future/person.png'
                alt='person'
                width={110}
                height={110}
                className='rounded-full'
              />
              <div
                style={{ color: 'var(--primary-color)' }}
                className='pt-4 uppercase font-extrabold text-lg'
              >
                Your title
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeamMembers />
      <Subscriber />
    </div>
  );
}

export default Index;
