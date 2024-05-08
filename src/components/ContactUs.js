'use client';

import { Breadcrumb, Button, Col, Form, Input, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

const siteKeyReCaptcha = process.env.NEXT_PUBLIC_SITE_KEY;

function ContactUs() {
  const [message, setMessage] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const submitHandler = async (values) => {
    try {
      const data = await axios.post('/api/get-data-contact/', values);

      setMessage(data.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const submitFailed = (error) => {
    console.log('error', error);
  };
  return (
    <>
      <div style={{ backgroundColor: '#F6F6F6' }}>
        <div className='container mx-auto py-4 px-6 md:px-'>
          <Breadcrumb
            style={{ color: 'var(--primary-color)' }}
            items={[
              {
                title: 'Home',
              },
              {
                title: 'Contact Us',
              },
            ]}
          />
        </div>
      </div>
      <div className='container mx-auto py-16 px-6 lg:px-6'>
        <Row gutter={16}>
          <Col span={12} xs={24} sm={24} md={24} lg={12} xl={12}>
            <div
              className='font-extrabold text-3xl pb-4 uppercase'
              style={{ color: 'var(--primary-color)' }}
            >
              Contact US
            </div>
            <div className='pb-4 text-base'>
              Have a question? We’re here to help! Our dedicated team at
              <span className='text-blue-900 font-medium'>
                Presco-Radiator-Caps.Com
              </span>{' '}
              is ready to address your inquiries. You can also access our
              engineering/development team by using our
            </div>
            <div>
              <Form
                layout='vertical'
                autoComplete='off'
                onFinish={submitHandler}
                onFinishFailed={submitFailed}
              >
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.Item
                      name='your-name'
                      label='Name'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your name',
                        },
                      ]}
                    >
                      <Input className='sm:w-full' />
                    </Form.Item>
                    <Form.Item
                      name='your-email'
                      label='Email'
                      rules={[
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please input your email!',
                        },
                      ]}
                    >
                      <Input className='sm:w-full' />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label='Select' name='avia_3_1'>
                      <Select>
                        <Select.Option value='Product Questions'>
                          Product Questions
                        </Select.Option>
                        <Select.Option value='Payment'>Payment</Select.Option>
                        <Select.Option value='Delivery'>Delivery</Select.Option>
                        <Select.Option value='Refund'>Refund</Select.Option>
                        <Select.Option value='My Orders'>
                          My Orders
                        </Select.Option>
                        <Select.Option value='My Account'>
                          My Account
                        </Select.Option>
                        <Select.Option value='Coupons'>Coupons</Select.Option>
                        <Select.Option value='Other'>Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='avia_4_1'
                      label='Comment'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your comment!',
                        },
                      ]}
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <ReCAPTCHA
                      size='normal'
                      sitekey={siteKeyReCaptcha}
                      onChange={() => setIsVerify(true)}
                    />
                    <br />
                  </Col>
                  <Col span={24} className='text-center lg:text-left'>
                    <Form.Item>
                      <Button
                        htmlType='submit'
                        type='primary'
                        className='ms:w-full'
                        style={{
                          color: '#fff',
                          backgroundColor: 'var(--primary-color)',
                          borderRadius: '4px',
                        }}
                      >
                        SEND YOUR MESSAGE
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
          <Col span={12} xs={24} sm={24} md={24} lg={12} xl={12}>
            <div className='w-full'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.380811234382!2d-2.2018762859153007!3d52.218298871866715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870f1b1c73476f9%3A0x9232e78d2580796!2sLesaffre%20UK%20%2B%20Ireland%20Ltd!5e0!3m2!1svi!2s!4v1712732701696!5m2!1svi!2s'
                width={550}
                height={420}
                className='w-full'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
            <div className='my-5'>
              <div className='leading-6'>
                <h3 className='font-bold'>Presco Radiator Caps Ltd</h3>
                <p>
                  Unit D86, Blackpole Trading Estate West Worcester, England,
                  WR3 8TJ
                </p>
                <p>
                  <span className='font-bold'>Tel:</span>: +44 (0)1905 755656,
                  <span className='font-bold'>Fax:</span>: +44 1905 755654
                </p>
                <p>
                  <span className='font-bold'>Emai:</span>{' '}
                  Sales@Presco-Radiator-Caps.Com
                </p>
                <p>There is parking on site</p>
                <p>
                  Our opening hours are 8 am-4.45 pm Monday to Thursday &
                  Fridays we are open until 12.30pm – Please leave a phone
                  message or email us
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <div>{message && <p>{message}</p>}</div>
      </div>
    </>
  );
}

export default ContactUs;
