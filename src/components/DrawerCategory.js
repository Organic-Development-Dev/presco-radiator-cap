import { Collapse, Drawer } from 'antd';
import CloseIcon from './icons/Close';
import { useRouter } from 'next/router';

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
          { name: 'Expansion Tank', slug: 'expansion-tank' },
          { name: 'Fuel Caps', slug: 'fuel-caps' },
          { name: 'Radiator Wing Caps', slug: 'radiator-wing-caps' },
          { name: 'Japanese Caps', slug: 'japanese-caps' },
          { name: 'Reservior Caps', slug: 'reservior-caps' },
          { name: 'Oil Caps', slug: 'oil-caps' },
          { name: 'Radiator Necks', slug: 'radiator-necks' },
        ],
      },
      {
        key: 2,
        name: 'Agricultural',
        children: [
          { name: 'Oil Caps', slug: 'oil-caps' },
          { name: 'Fuel Caps', slug: 'fuel-caps' },
          { name: 'Reservior Caps', slug: 'reservior-caps' },
          { name: 'Radiator Necks', slug: 'radiator-necks' },
          { name: 'Engine Parts', slug: 'engine-parts' },
        ],
      },
      {
        key: 3,
        name: 'Other Applications',
        children: [
          { name: 'Auto', slug: 'auto' },
          { name: 'Agricultura', slug: 'agricultura' },
          { name: 'Truck & Commercial', slug: 'commercial-caps' },
          { name: 'Radiator Necks', slug: 'radiator-necks' },
          { name: 'Sealing Caps', slug: 'sealing-caps' },
          { name: 'Ad Blue Caps', slug: 'ad-blue-caps' },
        ],
      },
    ],
  },
  {
    children: [
      {
        name: 'About Us',
        slug: '/about-us',
        children: [
          { name: 'Packaging', slug: '/' },
          { name: 'Inspection & Testing', slug: '/inspection-testing' },
          { name: 'Privacy Policy', slug: '/privacy-policy' },
          { name: 'Disclaimer', slug: '/disclaimer' },
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
            <div key={nav.name}>
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
            // defaultActiveKey={['1']}
            // expandIcon={({ isActive }) => (
            //   <CaretRightOutlined rotate={isActive ? 90 : 0} />
            // )}
            // style={{ background: token.colorBgContainer }}
            style={{ background: '#fff' }}
            expandIconPosition='end'
            items={nav?.children?.map((childNav) => {
              return {
                key: childNav.key,
                label: (
                  <div
                    style={{ color: 'var(--primary-color)' }}
                    className='text-base cursor-pointer font-semibold uppercase'
                  >
                    {childNav.name}
                  </div>
                ),
                children: childNav?.children ? (
                  <ul className='pb-2 pl-4'>
                    {childNav?.children?.map((child) => (
                      <li
                        style={{ color: 'var(--primary-color)' }}
                        className='text-base cursor-pointer list-disc'
                        onClick={() => {
                          router.push(`/product-category/expansion-tank`);
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
              };
            })}
          />
        </>
      ))}
    </Drawer>
  );
}

export default DrawerCategory;
