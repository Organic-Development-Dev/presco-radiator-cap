import { Breadcrumb, ConfigProvider, Image, Pagination } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import MenuIcon from './icons/Menu';
import DrawerFilterProduct from './DrawerFilterProduct';
import { DEFAULT_PRODUCT_HOME_IMG_URL } from '../constants/urls';
import { sortProducts } from '../utils/sort';  // Adjust the path as needed

export default function ProductsCategory(props) {
  const { dataCategory, products } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dataProducts, setDataProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    let attributesMap = {};
    products.forEach((product) => {
      product.attributes.forEach((attr) => {
        if (!attributesMap[attr.name]) {
          attributesMap[attr.name] = new Set(); // Use a Set to avoid duplicate terms
        }
        attr.options.forEach((option) => {
          attributesMap[attr.name].add(option);
        });
      });
    });

    Object.keys(attributesMap).forEach((key) => {
      attributesMap[key] = Array.from(attributesMap[key]);
    });

    // Sort products before setting the state
    setDataProducts(sortProducts(products));
  }, [products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = dataProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlerFilter = (selectedFilters) => {
    const filtered = products.filter((product) =>
      Object.keys(selectedFilters).every((attribute) =>
        product.attributes.some(
          (attr) =>
            attr.name === attribute &&
            selectedFilters[attribute].some((value) =>
              attr.options.includes(value)
            )
        )
      )
    );

    // Sort filtered products
    setDataProducts(sortProducts(filtered));
    setOpenDrawer(false);
  };

  return (
    <>
      <Head>
        <title>Presco Radiator Caps - {dataCategory.name}</title>
        <meta content={dataCategory.name} />
      </Head>
      <div className='container mx-auto py-4'>
        <Breadcrumb
          style={{ color: 'var(--primary-color)' }}
          items={[
            {
              title: 'Product & Solutions',
            },
            {
              title: dataCategory.name,
            },
          ]}
        />
      </div>
      <div className='py-4' style={{ backgroundColor: '#F6F6F6' }}>
        <div
          className='container mx-auto flex gap-4 items-center'
          onClick={() => setOpenDrawer(true)}
        >
          <MenuIcon fill='var(--primary-color)' width={30} height={30} />
          <div
            className='uppercase text-3xl font-semibold'
            style={{ color: 'var(--primary-color)' }}
          >
            Filter
          </div>
        </div>
      </div>

      <div className='container mx-auto py-4'>
        <div
          className='font-semibold text-xl uppercase'
          style={{ color: 'var(--primary-color)' }}
        >
          {dataCategory?.name}
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorBorderSecondary: 'transparent',
            },
            components: {
              Tabs: {
                itemHoverColor: 'var(--primary-color)',
                itemColor: 'var(--primary-color)',
                itemSelectedColor: 'var(--primary-color)',
                itemActiveColor: 'var(--primary-color)',
              },
            },
          }}
        >
          <div className='grid grid-cols-2 md:grid-cols-4 gap-y-20 py-4'>
            {currentProducts.map((product) => (
              <div
                onClick={() => router.push(`/product/${product.id}`)}
                key={product.id}
                className='text-center rounded-xl'
              >
                <div>
                  <Image
                    src={
                      product?.images[0]?.src ?? DEFAULT_PRODUCT_HOME_IMG_URL
                    }
                    alt='product'
                    height={120}
                    preview={false}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className='py-1 px-4 rounded-lg text-white inline-block text-xs mt-4 cursor-pointer'
                >
                  {product.name}
                </div>
              </div>
            ))}
          </div>
        </ConfigProvider>
        <Pagination
          current={currentPage}
          total={dataProducts.length}
          pageSize={productsPerPage}
          onChange={paginate}
          style={{ textAlign: 'center', paddingTop: '20px' }}
        />
        {products.length > 0 && (
          <DrawerFilterProduct
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            handlerFilter={(selectedFilters) => handlerFilter(selectedFilters)}
            products={products}
          />
        )}
      </div>
    </>
  );
}
