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
        key: 1,
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
        key: 2,
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
        key: 3,
        name: 'Other Applications',
        children: [
          { name: 'Auto', slug: '/product-category/auto' },
          { name: 'Agricultural', slug: '/product-category/agricultural' },
          { name: 'Truck & Commercial', slug: '/product-category/commercial-caps' },
          { name: 'Radiator Necks', slug: '/product-category/radiator-necks' },
          { name: 'Sealing Caps', slug: '/product-category/sealing-caps' },
          { name: 'Ad Blue Caps', slug: '/product-category/ad-blue-caps' },
        ],
      },
    ],
  },
  {
    children: [
      {
        slug: '/about-us',
        label: <Link href='/about-us'>About Us</Link>,
        children: [
          { name: 'Packaging', slug: '/packaging' },
          { name: 'Inspection & Testing', slug: '/inspection-testing' }
        ],
      },
    ],
  },
  {
    name: 'News',
    tab: 3,
    slug: '/news',
  },
  {
    name: 'Contact Us',
    tab: 4,
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
        <>
          {nav.name && (
            <div key={nav.key}>
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
            key={nav.slug}
            bordered={false}
            // defaultActiveKey={['1']}
            // expandIcon={({ isActive }) => (
            //   <CaretRightOutlined rotate={isActive ? 90 : 0} />
            // )}
            // style={{ background: token.colorBgContainer }}
            style={{ background: '#fff' }}
            expandIconPosition='end'
            items={nav?.children?.map((childNav, idx) => {
              return {
                key: childNav.key,
                label: (
                  <div
                    style={{ color: 'var(--primary-color)' }}
                    className='text-base cursor-pointer font-semibold uppercase'
                    key={idx}
                  >
                    {childNav.name || childNav.label}
                  </div>
                ),
                children: childNav?.children ? (
                  <ul className='pb-2 pl-4'>
                    {childNav?.children?.map((child, id) => (
                      <li
                        style={{ color: 'var(--primary-color)' }}
                        className='text-base cursor-pointer list-disc'
                        onClick={() => {
                          router.push(`${child.slug}`);
                          onClose();
                        }}
                        key={id}
                      >
                        {child.name}
                      </li>
                    ))}
                  </ul>
                ) : null,

                style: { border: 'none' },
              };
            })}
          />
        </>
      ))}
    </Drawer>
  );
}

export default DrawerCategory;
