import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Carousel, Button } from 'antd';
import { isEmpty } from "lodash";

import Slider from "react-slick";

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    fade: false,
    autoplay: true,
    autoplaySpeed: 3000,
};
const DiscordChanel = ({ messages }) => {
    console.log(messages)
    return (
        <div className="container py-5 mx-auto">
            <div className="discord-slider mt-10">
                <Slider {...settings}>
                    {messages.map((message) => (
                        <div className="discord-slider-item" key={message.id}>
                            {message.embeds && message.embeds.length > 0 && (
                                <div className="discord-slider-embed" >
                                    <p>{message.embeds[0].author.name}</p>
                                    <p>{message.embeds[0].description}</p>
                                    {!isEmpty(message.embeds[0].image) ? (
                                        <>
                                            <img
                                                src={message.embeds[0].image.url}
                                                alt='alt'
                                                width={message.embeds[0].image.width}
                                                height={message.embeds[0].image.height}
                                            />
                                        </>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
};
export default DiscordChanel;