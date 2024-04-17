import { Breadcrumb, ConfigProvider, Image, Pagination } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MenuIcon from '../../src/components/icons/Menu';
import DrawerFilterProduct from '../../src/components/DrawerFilterProduct';

export default function Index(props) {
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

    setDataProducts(products);
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

    setDataProducts(filtered);
    setOpenDrawer(false);
  };

  return (
    <>
      <div className='container mx-auto py-4'>
        <Breadcrumb
          style={{ color: 'var(--primary-color)' }}
          items={[
            {
              title: 'Home',
            },
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
                className='text-center'
              >
                <div>
                  <Image
                    src={product.images[0]?.src}
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
        <DrawerFilterProduct
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          handlerFilter={(selectedFilters) => handlerFilter(selectedFilters)}
          categoryId={dataCategory.id}
        />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const {
    params: { slug },
  } = context;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: dataCateRes } = await axios.get(
    `${apiBaseUrl}/api/products/categories`
  );

  let products = [];

  const dataCategory = dataCateRes.find((cate) => cate.slug == slug);

  if (dataCategory) {
    const dataProductsRes = await axios.get(
      `${apiBaseUrl}/api/products?category=${dataCategory.id}&per_page=100`
    );
    products = dataProductsRes.data;
  }

  return {
    props: {
      products,
      dataCategory,
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
