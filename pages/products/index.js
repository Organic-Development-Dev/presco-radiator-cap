import {
  Breadcrumb,
  Checkbox,
  ConfigProvider,
  Drawer,
  Image,
  Row,
  Tabs,
} from 'antd';
import { useRouter } from 'next/router';
import MenuIcon from '../../src/components/icons/Menu';
import { useMemo, useState } from 'react';
import CloseIcon from '../../src/components/icons/Close';
import DrawerFilterProduct from '../../src/components/DrawerFilterProduct';

export default function Index(props) {
  const { products, categories } = props;
  const [dataProducts, setDataProducts] = useState(products);
  const [tabActive, seTabActive] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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

  const handlerFetchProductsByCategoryId = async (key) => {
    router.push(`/product-category/${key}`);
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
          <Tabs
            items={categories.map((item) => {
              return {
                key: item.slug,
                label: item.name,
              };
            })}
            onChange={handlerFetchProductsByCategoryId}
          />
          <div className='grid grid-cols-4 gap-y-20 py-4'>
            {dataProducts.map((product) => (
              <div key={product.id} className='text-center'>
                <div>
                  <Image
                    src={product.images[0].src}
                    alt='product'
                    width={200}
                    height={93}
                  />
                </div>
                <div
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className='py-1 px-4 rounded-lg text-white inline-block text-xs mt-4 cursor-pointer'
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  {product.name}
                </div>
              </div>
            ))}
          </div>
        </ConfigProvider>
      </div>
      <DrawerFilterProduct
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        handlerFilter={(selectedFilters) => handlerFilter(selectedFilters)}
      />
    </>
  );
}

export async function getStaticProps() {
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiBaseUrl}/api/products`);
        const dataCateRes = await fetch(`${apiBaseUrl}/api/products/categories`);
        const products = await response.json();
        const categories = await dataCateRes.json();

        return {
            props: {
                products,
                categories: categories.map((cate) => {
                    const { id, name, slug } = cate;
                    return {
                        id,
                        name,
                        slug,
                    };
                }),
            },
        };
    } catch (error) {
        console.error('Error fetching data in getStaticProps:', error);
        return {
            props: {
                products: [],
                categories: [],
            },
        };
    }
}
