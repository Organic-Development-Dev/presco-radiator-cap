import { Button, Input } from 'antd';

function Subscriber() {
  return (
    <div id='subscribe' className='p-10'>
      <div className='container mx-auto'>
        <div className='font-bold text-center uppercase text-2xl text-white'>
          SUBSCRIBER
        </div>
        <div className='text-white text-center font-thin pb-4'>
          Want to stay up to date? Subscribe to our Newsletter!
        </div>
        <div className='flex gap-2 justify-center'>
          <Input
            className='placeholder-white'
            placeholder='Email*'
            style={{ width: 250 }}
          />
          <Button
            className='font-semibold '
            style={{ color: 'var(--primary-color)' }}
          >
            Suscribe
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Subscriber;
