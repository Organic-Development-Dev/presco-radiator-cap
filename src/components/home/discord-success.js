import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Carousel, Button } from 'antd';
import { isEmpty } from "lodash";

import Slider from "react-slick";

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
const DiscordSuccess = ({ messages }) => {
    return (
        <div className="discord-slider mt-10">
            <h2 className="products-main-title main-title mb-5 text-xl uppercase"><span className="main-title-inner">Members live successes </span></h2>

            <Slider {...settings}>
                {messages.map((message) => (
                    <div className="discord-slider-item" key={message.id}>
                        {/* Display attachments if available */}
                        {message.attachments && message.attachments.length > 0 && (
                            <>
                                {message.attachments[0].width && message.attachments[0].height ? (
                                    <img
                                        key={message.attachments[0].id}
                                        src={message.attachments[0].url}
                                        alt={message.attachments[0].filename}
                                        width={message.attachments[0].width}
                                        height={message.attachments[0].height}
                                    />
                                ) : (
                                    <a key={message.attachments[0].id} href={message.attachments[0].url}>
                                        {message.attachments[0].filename}
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    )
};
export default DiscordSuccess;