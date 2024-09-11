import { Collapse, Drawer } from 'antd';
import CloseIcon from './icons/Close';
import { useRouter } from 'next/router';
import Link from 'next/link';

const dataNavs = [
  {
    name: 'Products & Solutions',
    tab: 1,
    slug: '/',
    children: [
      {
        key: '1',
        name: 'Auto',
        children: [
          { name: 'Expansion Tank', slug: '/product-category/expansion-tank' },
          { name: 'Fuel Caps', slug: '/product-category/fuel-caps' },
          { name: 'Radiator Wing Caps', slug: '/product-category/radiator-wing-caps' },
          { name: 'Japanese Caps', slug: '/product-category/japanese-caps' },
          { name: 'Reservior Caps', slug: '/product-category/reservior-caps' },
          { name: 'Oil Caps', slug: '/product-category/oil-caps' },
          { name: 'Radiator Necks', slug: '/product-category/radiator-necks' },
        ],
      },
      {
        key: '2',
        name: 'Agricultural',
        children: [
          { name: 'Oil Caps', slug: '/product-category/oil' },
          { name: 'Fuel Caps', slug: '/product-category/fuel' },
          { name: 'Radiator Caps', slug: '/product-category/radiator' },
          { name: 'Radiator Necks', slug: '/product-category/radiator-necks-agricultural' },
          { name: 'Engine Parts', slug: '/product-category/other-applications' },
        ],
      },
      {
        key: '3',
        name: 'Other Applications',
        children: [
          { name: 'Truck & Commercial', slug: '/product-category/commercial-caps' },
          { name: 'Radiator Necks', slug: '/product-category/radiator-necks' },
          { name: 'Sealing Caps', slug: '/product-category/sealing-caps' },
          { name: 'Ad Blue Caps', slug: '/product-category/ad-blue-caps' },
        ],
      },
    ],
  },
  {
    name: 'Quality',
    tab: 2,
    slug: '/quality',
    children: [
      {
        key: '1',
        name: 'Quality',
        children: [
          { name: 'ISO', slug: '/iso' },
          { name: 'Inspection & Testing', slug: '/inspection-testing' },
          { name: 'Packaging', slug: '/packaging' },
        ],
      },
    ],
  },
  {
    name: 'About Us',
    tab: 3,
    slug: '/about-us',
    children: [
      {
        key: '1',
        name: 'About Us',
        children: [
          { name: 'History', slug: '/about-us' },
          { name: 'Meet the team', slug: '/about-us' },
          { name: 'Visit us', slug: '/contact-us' },
        ],
      },
    ],
  },
  {
    name: 'News',
    tab: 4,
    slug: '/news',
  },
  {
    name: 'Contact Us',
    tab: 5,
    slug: '/contact-us',
  },
];

function DrawerCategory(props) {
  const { open, onClose } = props;
  const router = useRouter();

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
      {dataNavs.map((nav) => (
        <div key={nav.tab}>
          {nav.name && (
            <div>
              <div
                style={{ color: 'var(--primary-color)' }}
                className='font-semibold uppercase text-lg mb-4 px-3'
                onClick={() => {
                  router.push(nav.slug);
                  onClose();
                }}
              >
                {nav.name}
              </div>
            </div>
          )}
          <Collapse
            bordered={false}
            style={{ background: '#fff' }}
            expandIconPosition='end'
            items={nav.children?.map((childNav) => ({
              key: childNav.key,
              label: (
                <div
                  style={{ color: 'var(--primary-color)' }}
                  className='text-base cursor-pointer font-semibold uppercase'
                >
                  {childNav.name}
                </div>
              ),
              children: childNav.children ? (
                <ul className='pb-2 pl-4'>
                  {childNav.children.map((child) => (
                    <li
                      style={{ color: 'var(--primary-color)' }}
                      className='text-base cursor-pointer list-disc'
                      onClick={() => {
                        router.push(child.slug);
                        onClose();
                      }}
                      key={child.name}
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              ) : null,
              style: { border: 'none' },
            }))}
          />
        </div>
      ))}
    </Drawer>
  );
}

export default DrawerCategory;
