import axios from 'axios';
import dynamic from 'next/dynamic';

const SearchPage = dynamic(() => import('../../src/components/SearchPage'), {
  ssr: false,
});

function Index({ products, search }) {
  return <SearchPage products={products} search={search} />;
}

export default Index;

export async function getServerSideProps(context) {
  const { query } = context;
  const name = query.name;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: products } = await axios.get(
    `${apiBaseUrl}/api/products?search=${name}`
  );
  //   console.log(query);

  // Bạn có thể dùng giá trị `productName` để làm gì đó, ví dụ lấy dữ liệu từ API

  return {
    props: {
      products,
      search: name,
    },
  };
}
