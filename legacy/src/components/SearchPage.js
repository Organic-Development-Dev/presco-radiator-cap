import { Divider, Image, Typography, Spin } from 'antd';
import Search from 'antd/es/input/Search';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {DEFAULT_PRODUCT_HOME_IMG_URL} from "../constants/urls";

function SearchPage({ products, search, loading = false }) {
  const router = useRouter();
  const { Title } = Typography;
  const [searchValue, setSearchValue] = useState(search);
  
  useEffect(() => {
    setSearchValue(search);
  }, [search]);
  
  return (
    <div className='container mx-auto py-16 px-4'>
      <div className='pb-4 text-center'>
        <Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='input search text'
          size='large'
          className='w-full max-w-md mx-auto'
          onSearch={(value, _e, info) => {
            if (value && value.trim()) {
              router.push(`/search?name=${encodeURIComponent(value.trim())}`);
            }
          }}
        />
          <Title className='pt-4 text-center' level={2}>Search Result for: <span>{search}</span></Title>
      </div>
      <Divider />
      <div>
        {loading ? (
          <div className='text-center py-8'>
            <Spin size="large" />
            <p className='text-gray-500 mt-2'>Searching...</p>
          </div>
        ) : products.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-y-20 py-4'>
            {products.map((product) => (
                <div
                    onClick={() => router.push(`/product/${product.id}`)}
                    key={product.id}
                    className='text-center cursor-pointer'
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
                        className='py-1 px-4 rounded-lg text-white inline-block text-xs mt-4'
                    >
                        {product.name}
                    </div>
                </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <Title level={4}>No products found for "{search}"</Title>
            <p className='text-gray-500 mt-2'>Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
