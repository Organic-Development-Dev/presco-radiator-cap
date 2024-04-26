import { Divider, Image } from 'antd';
import Search from 'antd/es/input/Search';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

function SearchPage({ products, search }) {
  const router = useRouter();
  return (
    <div className='container mx-auto py-16'>
      <div className='pb-4'>
        <Search
          defaultValue={search}
          placeholder='input search text'
          size='large'
          style={{ width: 300 }}
          onSearch={(value, _e, info) => router.push(`/search?name=${value}`)}
        />
      </div>
      <Divider />
      <div>
        <div className='pb-4'>
          Search Result for: <span>{search}</span>
        </div>
        {products.length && (
          <div className='flex flex-col gap-2'>
            {products.map((product) => (
              <Link
                // onClick={() => router.push(`/product/${product.id}`)}
                href={`/product/${product.id}`}
                key={product.name}
              >
                <div className='flex gap-2 cursor-pointer'>
                  <div>
                    <Image
                      src={product.images[0].src}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>
                    <div className='font-semibold'>{product.name}</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.short_description,
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
