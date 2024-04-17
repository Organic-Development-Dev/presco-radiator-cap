import { Button, Col, Form, Input, Row, message } from 'antd';
import React, { useState } from 'react';
import { API_KEY_KLAVIYO } from '../../config/config';

const KlaviyoForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onSubmitFormKlaviyo = async (value) => {
        setLoading(true);
        const data = await fetch("/api/subcribe-klaviyo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
        })
        if(data.status === 200) {
            message.success("Success, Please check your email!")
        } else {
            message.error("Please try again!");
        }
        setLoading(false);
    };

    return (
        <div className="klaviyo-container">
            <Form
                id="form-klaviyo"
                form={form}
                layout="vertical"
                style={{ top: 0 }}
                onFinish={onSubmitFormKlaviyo}
            >
                <h3 className='text-center font-semibold text-2xl mb-2'>Sign up for our newsletter</h3>
                <Row gutter={{ md: 12 }}>
                    <Col xs={20}>
                        <Form.Item rules={[
                            { required: true, message: "Please enter your email!" },
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                        ]} name="email" >
                            <Input size='large' placeholder='Enter your email' />
                        </Form.Item>
                    </Col>
                    <Col xs={4}>
                        <Form.Item>
                            <Button size='large' style={{ backgroundColor: '#303B43' }} type="primary" htmlType="submit" loading={loading} >
                                Subcribe
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>

    );
};

export default KlaviyoForm;
