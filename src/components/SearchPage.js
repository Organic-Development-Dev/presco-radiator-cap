import { Divider, Image, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {DEFAULT_PRODUCT_HOME_IMG_URL} from "../constants/urls";

function SearchPage({ products, search }) {
  const router = useRouter();
  const { Title } = Typography;
  return (
    <div className='container mx-auto py-16'>
      <div className='pb-4 text-center'>
        <Search
          defaultValue={search}
          placeholder='input search text'
          size='large'
          style={{ width: 300 }}
          onSearch={(value, _e, info) => router.push(`/search?name=${value}`)}
        />
          <Title className='pt-4 text-center' level={2}>Search Result for: <span>{search}</span></Title>
      </div>
      <Divider />
      <div>
        {products.length && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-y-20 py-4'>
            {products.map((product) => (
                <div
                    onClick={() => router.push(`/product/${product.id}`)}
                    key={product.id}
                    className='text-center'
                >
                    <div>
                        <Image
                            src={product?.images[0]?.src ?? DEFAULT_PRODUCT_HOME_IMG_URL}
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
        )}
      </div>
    </div>
  );
}

export default SearchPage;
