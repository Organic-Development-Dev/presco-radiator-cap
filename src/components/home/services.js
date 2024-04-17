import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Carousel } from 'antd';
import Slider from "react-slick";
import { PayCircleOutlined, DollarOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    fade: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};
const Services = ({ messages }) => {
    return (
        <Row className='mt-4'>
            <Col className="gutter-row" span={24}>
                <div className="service-items p-4">
                    <Slider {...settings}>
                        <div className="service-item">
                            <PayCircleOutlined style={{ fontSize: '26px' }} />
                            <p>Secure Payment</p>
                        </div>
                        <div className="service-item">
                            <DollarOutlined style={{ fontSize: '26px' }} />
                            <p>Pay using crypto</p>
                        </div>
                        <div className="service-item">
                            <DeleteOutlined style={{ fontSize: '26px' }} />
                            <p>Cancel Subscription</p>
                        </div>
                        <div className="service-item">
                            <UserOutlined style={{ fontSize: '26px' }} />
                            <p>Manage your account</p>
                        </div>
                    </Slider>
                </div>
            </Col>
        </Row>
    )
};
export default Services;