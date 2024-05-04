import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dropdown, Popover, Space, Typography } from 'antd';
import SvgArrowDown from './icons/ArrowDown';
import SearchIcon from './icons/Search';
import { useRouter } from 'next/router';
import DrawerCategory from './DrawerCategory';
import dynamic from 'next/dynamic';
// import ModalSearch from './ModalSearch';

const dataChildSolutionAndProduct = {
  title: 'Products & Solutions',
  children: [
    {
      title: 'auto',
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
      title: 'Agricultural',
      children: [
        { name: 'Oil Caps', slug: 'oil-caps' },
        { name: 'Fuel Caps', slug: 'fuel-caps' },
        { name: 'Reservior Caps', slug: 'reservior-caps' },
        { name: 'Radiator Necks', slug: 'radiator-necks' },
        { name: 'Engine Parts', slug: 'engine-parts' },
      ],
    },
    {
      title: 'Other Applications',
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
};

const dataNavs = [
  {
    name: 'Products & Solutions',
    tab: 1,
    slug: '/',
    children: [
      {
        key: '1',
        label: (
          <div
            style={{
              color: 'var(--primary-color)',
              width: 750,
              padding: '20px 50px',
            }}
          >
            <div className='text-lg font-semibold text-center'>
              {dataChildSolutionAndProduct.title}
            </div>
            <div className='flex justify-between mt-4'>
              {dataChildSolutionAndProduct.children.map((childNav) => (
                <div key={childNav.title}>
                  <div
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    className='uppercase px-2 text-white font-semibold inline-block rounded-lg mb-2'
                  >
                    {childNav.title}
                  </div>
                  <ul>
                    {childNav.children.map((item) => (
                      <li key={item.name}>
                        <Link href={`/product-category/${item.slug}`}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: 'About Us',
    tab: 2,
    slug: '/about-us',
    children: [
      {
        key: '1',
        label: (
          <ul>
            <li
              className='font-semibold'
              style={{ color: 'var(--primary-color)' }}
            >
              Packaging
            </li>
            <li
              className='font-semibold'
              style={{ color: 'var(--primary-color)' }}
            >
              <Link href='/inspection-testing'>Inspection & Testing</Link>
            </li>
          </ul>
        ),
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

const ModalSearch = dynamic(() => import('/src/components/ModalSearch.js'), {
  ssr: false,
});

const Nav = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  return (
    <nav className='bg-white py-4'>
      <div className='flex items-center justify-between flex-wrap container mx-auto'>
        <div className='flex items-center flex-shrink-0'>
          <span className='font-semibold text-xl tracking-tight'>
            <Link href='/'>
              <div style={{ width: 172 }}>
                <Image
                  src='/img/logo.png'
                  layout='responsive'
                  width={172}
                  height={72}
                  alt='logo'
                />
              </div>
            </Link>
          </span>
        </div>

        <div className='gap-10 items-center hidden lg:flex'>
          {dataNavs.map((nav) =>
            nav?.children ? (
              <Dropdown
                key={nav.name}
                menu={{ items: nav?.children }}
                placement='bottom'
                className='cursor-pointer'
              >
                <div
                  style={{ color: 'var(--primary-color)' }}
                  className='font-semibold text-base'
                >
                  <Space>
                    {nav.name}
                    {nav?.children && (
                      <SvgArrowDown
                        width={20}
                        height={20}
                        fill='var(--primary-color)'
                      />
                    )}
                  </Space>
                </div>
              </Dropdown>
            ) : (
              <div
                style={{ color: 'var(--primary-color)' }}
                className='font-semibold text-base cursor-pointer'
                onClick={() => router.push(nav.slug)}
                key={nav.name}
              >
                {nav.name}
              </div>
            )
          )}

          <div
            style={{ backgroundColor: 'var(--primary-color)' }}
            className='p-2 rounded-full'
            onClick={() => setOpenSearch(true)}
          >
            <SearchIcon width={15} height={15} />
          </div>
        </div>

        {/*Menu button*/}
        <div className='lg:hidden flex gap-2 items-center'>
          <SearchIcon
            onClick={() => setOpenSearch(true)}
            stroke='var(--primary-color)'
            width={25}
            height={25}
          />
          <div className='menu-btn'>
            <button
              onClick={() => setOpenDrawer(true)}
              className='flex items-center px-3 py-2'
            >
              <svg
                height='auto'
                width='100'
                className='fill-current h-6 w-6'
                fill='var(--primary-color)'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
              </svg>
            </button>
          </div>
        </div>

        {/*MMenu in mobile*/}
        <DrawerCategory
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />
        <ModalSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      </div>
    </nav>
  );
};

export default Nav;
