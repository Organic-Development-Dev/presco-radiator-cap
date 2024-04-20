import { Drawer } from 'antd';
import CloseIcon from './icons/Close';

function DrawerCategory(props) {
  const { open, onClose, dataCategory } = props;
  return (
    <Drawer
      id='drawer-category'
      open={open}
      onClose={onClose}
      closeIcon={null}
      placement='left'
      title={
        <div
          onClick={onClose}
          className='p-1 rounded-lg inline-block float-right'
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <CloseIcon fill='#fff' width={20} height={20} />
        </div>
      }
    >
      <div>
        <div
          style={{ backgroundColor: 'var(--primary-color)' }}
          className='font-semibold uppercase text-lg text-white text-center mb-4'
        >
          {dataCategory.title}
        </div>
        <div>
          {dataCategory.children.map((cate) => (
            <div key={cate.name}>
              <div
                style={{ color: 'var(--primary-color)' }}
                className='text-base cursor-pointer font-semibold uppercase'
              >
                {cate.title}
              </div>
              <ul className='pb-2 pl-4'>
                {cate.children.map((child) => (
                  <li
                    style={{ color: 'var(--primary-color)' }}
                    className='text-base cursor-pointer list-disc'
                    onClick={() => router.push(nav.slug)}
                    key={child.name}
                  >
                    {child.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

export default DrawerCategory;
