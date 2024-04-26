import { Divider, Image } from 'antd';
import Search from 'antd/es/input/Search';
import Modal from 'antd/es/modal/Modal';
import { useRouter } from 'next/router';

function ModalSearch(props) {
  const { open, onClose } = props;
  const router = useRouter();
  return (
    <Modal
      closeIcon={<></>}
      open={open}
      onCancel={onClose}
      footer={null}
      title={'Search product by name'}
    >
      <Search
        size='large'
        placeholder='Search product'
        onSearch={(value, _e, info) => {
          router.push(`/search?name=${value}`);
          onClose();
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
