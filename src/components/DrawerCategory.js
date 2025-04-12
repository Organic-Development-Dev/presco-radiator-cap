import { Collapse, Drawer } from 'antd';
import CloseIcon from './icons/Close';
import { useRouter } from 'next/router';
import { useState } from 'react';

// Data for navigation
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
        ],
      },
      {
        key: '2',
        name: 'Agricultural',
        children: [
          { name: 'Oil Caps', slug: '/product-category/oil' },
          { name: 'Fuel Caps', slug: '/product-category/fuel' },
          { name: 'Radiator Caps', slug: '/product-category/radiator' },
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
    //name: 'Quality',
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
    //name: 'About Us',
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
  const [expandedKeys, setExpandedKeys] = useState([]);

  // Handle navigation
  const handleNavigation = (url) => {
    onClose();
    router.push(url);
  };

  // Simplified drawer items to avoid complex nesting
  const getCollapseItems = () => {
    return dataNavs.map(nav => {
      if (!nav.children) {
        return (
          <div key={nav.tab} className="mb-4">
            <div
              onClick={() => handleNavigation(nav.slug)}
              style={{ color: 'var(--primary-color)' }}
              className='font-semibold uppercase text-lg px-3 py-2 cursor-pointer'
            >
              {nav.name}
            </div>
          </div>
        );
      }

      return (
        <div key={nav.tab} className="mb-4">
          {nav.name && (
            <div
              onClick={() => handleNavigation(nav.slug)}
              style={{ color: 'var(--primary-color)' }}
              className='font-semibold uppercase text-lg px-3 py-2 cursor-pointer'
            >
              {nav.name}
            </div>
          )}
          
          {nav.children && nav.children.map(section => (
            <div key={section.key} className="mb-2">
              <div
                onClick={() => {
                  const newKeys = expandedKeys.includes(section.key)
                    ? expandedKeys.filter(k => k !== section.key)
                    : [...expandedKeys, section.key];
                  setExpandedKeys(newKeys);
                }}
                style={{ color: 'var(--primary-color)' }}
                className='text-base cursor-pointer font-semibold uppercase px-3 py-2 flex justify-between'
              >
                <span>{section.name}</span>
                <span>{expandedKeys.includes(section.key) ? '−' : '+'}</span>
              </div>
              
              {expandedKeys.includes(section.key) && section.children && (
                <ul className='pl-8 pb-2'>
                  {section.children.map(item => (
                    <li
                      key={item.name}
                      onClick={() => handleNavigation(item.slug)}
                      style={{ color: 'var(--primary-color)' }}
                      className='text-base cursor-pointer py-2 list-disc'
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    });
  };

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
      {getCollapseItems()}
    </Drawer>
  );
}

export default DrawerCategory;