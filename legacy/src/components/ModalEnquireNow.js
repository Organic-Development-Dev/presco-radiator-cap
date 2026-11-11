import { Button, Form, Input } from 'antd';
import Modal from 'antd/es/modal/Modal';
import CloseIcon from './icons/Close';
import TextArea from 'antd/es/input/TextArea';

function ModalEnquireNow(props) {
  const { open, onCancel, onOk, type } = props;
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      footer={null}
      width={400}
      bodyStyle={{ padding: '30px 16px' }}
      closeIcon={
        <div
          className='p-1 rounded-lg'
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <CloseIcon fill='#fff' width={20} height={20} />
        </div>
      }
    >
      <div>
        <div
          className='font-semibold text-lg pb-4'
          style={{ color: 'var(--primary-color)' }}
        >
          {type == 1 ? 'Enquire Now' : 'Order Now'}
        </div>
        <Form>
          <Form.Item>
            <Input className='placeholder-gray-700' placeholder='Your Name*' />
          </Form.Item>
          <Form.Item>
            <Input className='placeholder-gray-700' placeholder='Email*' />
          </Form.Item>
          <Form.Item>
            <TextArea
              className='placeholder-gray-700'
              rows={4}
              placeholder='Your Question*'
            />
          </Form.Item>
          <Button
            className='flex items-center text-white'
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Send
          </Button>
        </Form>
      </div>
    </Modal>
  );
}

export default ModalEnquireNow;
