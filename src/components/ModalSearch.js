import { Divider, Image } from 'antd';
import Search from 'antd/es/input/Search';
import Modal from 'antd/es/modal/Modal';
import { useRouter } from 'next/router';

function ModalSearch(props) {
  const { open, onClose } = props;
  const router = useRouter();
  
  console.log('ModalSearch rendered with open:', open);
  
  return (
    <Modal
      closeIcon={<></>}
      visible={open}
      onCancel={onClose}
      footer={null}
      title={'Search product by name'}
      width='90%'
      style={{ maxWidth: '500px' }}
      centered
    >
      <Search
        size='large'
        placeholder='Search product'
        onSearch={(value, _e, info) => {
          if (value && value.trim()) {
            router.push(`/search?name=${encodeURIComponent(value.trim())}`);
            onClose();
          }
        }}
      />
      {/* <div>
        <div className='flex gap-2 items-center px-4 pb-4'>
          <Image src='/img/product.png' width={80} />
          <div>Product name</div>
        </div>
        <div className='flex gap-2 items-center px-4 pb-4'>
          <Image src='/img/product.png' width={80} />
          <div>Product name</div>
        </div>
        <div className='flex gap-2 items-center px-4 pb-4'>
          <Image src='/img/product.png' width={80} />
          <div>Product name</div>
        </div>
      </div> */}
    </Modal>
  );
}

export default ModalSearch;
