import { Drawer } from 'antd';
import CloseIcon from './icons/Close';
import { useState } from 'react';
import Link from 'next/link';

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

// Simple drawer category component
function DrawerCategory(props) {
  const { open, onClose } = props;
  const [expandedKeys, setExpandedKeys] = useState([]);

  // Handle link click to close drawer
  const handleLinkClick = () => {
    onClose();
  };

  // Toggle section
  const toggleSection = (key) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter(k => k !== key));
    } else {
      setExpandedKeys([...expandedKeys, key]);
    }
  };

  return (
    <Drawer
      id='drawer-category'
      open={open}
      onClose={onClose}
      closeIcon={null}
      placement='left'
      width="85%"
      title={
        <div
          onClick={onClose}
          style={{
            backgroundColor: 'var(--primary-color)',
            padding: '8px',
            borderRadius: '8px',
            float: 'right',
            cursor: 'pointer'
          }}
        >
          <CloseIcon fill='#fff' width={20} height={20} />
        </div>
      }
      bodyStyle={{ padding: '10px 0' }}
    >
      <div>
        {dataNavs.map((nav) => (
          <div key={nav.tab} style={{ marginBottom: '16px' }}>
            {/* Main navigation item */}
            {nav.name && (
              <Link href={nav.slug} passHref>
                <a
                  onClick={handleLinkClick}
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '18px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  {nav.name}
                </a>
              </Link>
            )}
            
            {/* Subcategories */}
            {nav.children?.map((section) => (
              <div key={section.key} style={{ marginBottom: '8px' }}>
                {/* Section header */}
                <div
                  onClick={() => toggleSection(section.key)}
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '16px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{section.name}</span>
                  <span>{expandedKeys.includes(section.key) ? '−' : '+'}</span>
                </div>
                
                {/* Section items (only shown when expanded) */}
                {expandedKeys.includes(section.key) && section.children && (
                  <ul style={{ 
                    listStyleType: 'disc', 
                    paddingLeft: '32px',
                    margin: '0'
                  }}>
                    {section.children.map((item) => (
                      <li
                        key={item.name}
                        style={{
                          color: 'var(--primary-color)',
                          padding: '0',
                          cursor: 'pointer'
                        }}
                      >
                        <Link href={item.slug} passHref>
                          <a 
                            onClick={handleLinkClick}
                            style={{
                              color: 'var(--primary-color)',
                              padding: '12px 8px',
                              display: 'block',
                              width: '100%'
                            }}
                          >
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Drawer>
  );
}

export default DrawerCategory;