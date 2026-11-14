import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { Fragment, useState } from 'react';

function Subscriber() {
  const [email, setEmail] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  const openMessage = () => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: 'Subscribed Successfully!',
        duration: 2,
      });
    }, 1000);
  };

  const openMessageErr = () => {
    messageApi.open({
      type: 'error',
      content: 'Email is invalid!',
    });
  };

  const handleSubmit = async (e) => {
    const email = e.target.email.value;
    e.preventDefault();

    if (!email) {
      openMessageErr();
    } else {
      const { data } = await axios.post(
        'http://localhost:3000/api/newsletter',
        {
          email,
        }
      );
      if (data.status) {
        openMessage();
        e.target.email.value = '';
      }
    }
  };
  return (
    <Fragment>
      {contextHolder}
      <div id='subscribe' className='p-10'>
        <div className='container mx-auto'>
          <div className='font-bold text-center uppercase text-2xl text-white'>
            SUBSCRIBE
          </div>
          <div className='text-white text-center font-thin pb-4'>
            Want to stay up to date? Subscribe to our Newsletter!
          </div>
          <form onSubmit={handleSubmit}>
            <div className='flex gap-2 justify-center'>
              <Input
                className='placeholder-white'
                placeholder='Email*'
                style={{ width: 250 }}
                name='email'
                type='email'
              />
              <Button
                htmlType='submit'
                className='font-semibold '
                style={{ color: 'var(--primary-color)' }}
              >
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default Subscriber;
