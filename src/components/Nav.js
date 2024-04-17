import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dropdown, Popover, Space, Typography } from 'antd';
import SvgArrowDown from './icons/ArrowDown';
import SearchIcon from './icons/Search';
import { useRouter } from 'next/router';
import DrawerCategory from './DrawerCategory';

const dataChildSolutionAndProduct = {
  title: 'Products & Solutions',
  children: [
    {
      title: 'auto',
      children: [
        { name: 'Expansion Tank', slug: 'expansion-tank' },
        { name: 'Fuel Caps' },
        { name: 'Radiator Wing Caps' },
        { name: 'Japanese Caps' },
        { name: 'Reservior Caps' },
        { name: 'Oil Caps' },
        { name: 'Radiator Necks' },
      ],
    },
    {
      title: 'Agricultural',
      children: [
        { name: 'Oil Caps' },
        { name: 'Fuel Caps' },
        { name: 'Reservior Caps' },
        { name: 'Radiator Necks' },
        { name: 'Engine Parts' },
      ],
    },
    {
      title: 'Other Applications',
      children: [
        { name: 'Auto' },
        { name: 'Agricultura' },
        { name: 'Truck & Commercial' },
        { name: 'Radiator Necks' },
        { name: 'Sealing Caps' },
        { name: 'Ad Blue Caps' },
      ],
    },
  ],
};

const dataNavs = [
  {
    name: 'Products & Solutions',
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
                        <Link href='/product-category/expansion-tank'>
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
    slug: '/about-us',
  },
  {
    name: 'News',
    slug: '/news',
  },
  {
    name: 'Contact Us',
    slug: '/contact-us',
  },
];

const Nav = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
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

        <div className='gap-10 items-center hidden sm:flex'>
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
              >
                {nav.name}
              </div>
            )
          )}

          <div
            style={{ backgroundColor: 'var(--primary-color)' }}
            className='p-2 rounded-full '
          >
            <SearchIcon width={15} height={15} />
          </div>
        </div>

        {/*Menu button*/}
        <Popover
          placement='bottomRight'
          content={
            <div
              className='font-semibold flex flex-col'
              style={{ color: 'var(--primary-color)' }}
            >
              <div onClick={() => setOpenDrawer(true)}>
                Products & Solutions
              </div>
              <Link href='/about-us'>About Us</Link>
              <Link href='/about-us'>Resources</Link>
              <Link href='/about-us'>Contact Us</Link>
            </div>
          }
        >
          <div className='menu-btn block sm:hidden'>
            <button className='flex items-center px-3 py-2'>
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
        </Popover>

        {/*MMenu in mobile*/}
        <DrawerCategory
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          dataCategory={dataChildSolutionAndProduct}
        />
      </div>
    </nav>
  );
};

export default Nav;
