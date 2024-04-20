import { Divider, Image } from 'antd';
import Search from 'antd/es/input/Search';
import Modal from 'antd/es/modal/Modal';

function ModalSearch(props) {
  const { open, onClose } = props;
  return (
    <Modal
      closeIcon={<></>}
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
    >
      <Search placeholder='Search product' />
      <Divider />
      <div>
        <div className='flex gap-2 items-center px-4 pb-4'>
          <Image src='/fake-image-delete-in-future/product.png' width={80} />
          <div>Product name</div>
        </div>
        <div className='flex gap-2 items-center px-4 pb-4'>
          <Image src='/fake-image-delete-in-future/product.png' width={80} />
          <div>Product name</div>
        </div>
        <div className='flex gap-2 items-center px-4 pb-4'>
          <Image src='/fake-image-delete-in-future/product.png' width={80} />
          <div>Product name</div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalSearch;
