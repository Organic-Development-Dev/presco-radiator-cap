import React, { useMemo } from 'react';
import { Tabs } from "antd";

const TabVertical = () => {
    const tabOptions = useMemo(() => {
        return [
            {
                key: 1,
                value: 'Educate you',
                children: 'Not only will signals be shared but also techincal analysis so you can start to understand why the signals are being given'
            },
            {
                key: 2,
                value: 'Guide you',
                children: 'There will be people on hand to help and advise you plus there are other supportive members that will be willing to help with there real life experiences'
            },
            {
                key: 3,
                value: 'Earn Money',
                children: 'We are here to help you earn money, this is not a get rich scheme this is a long term investment using compound interest to help you earn good profits.'
            },
        ]
    }, [])
    return (
        <div className="tabs-home">
            {/* <h2 className="products-main-title main-title mb-5 text-xl uppercase"><span className="main-title-inner">We are here go</span></h2> */}
            <Tabs
                defaultActiveKey="1"
                size='middle'
                tabPosition='left'
                items={tabOptions.map(item => {
                    return {
                        label: item.value,
                        key: item.key,
                        children: item.children
                    }
                })}
            />
        </div>

    );
};

export default TabVertical;
