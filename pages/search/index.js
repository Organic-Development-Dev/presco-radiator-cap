import axios from 'axios';
import dynamic from 'next/dynamic';
import {useState} from "react";
import {Pagination} from "antd";

const SearchPage = dynamic(() => import('../../src/components/SearchPage'), {
  ssr: false,
});

function Index({ products, search }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);
  const [dataProducts, setDataProducts] = useState(products);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = dataProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
      <>
        <SearchPage products={currentProducts} search={search} />
        <Pagination
            current={currentPage}
            total={dataProducts.length}
            pageSize={productsPerPage}
            onChange={paginate}
            style={{ textAlign: 'center', marginBottom: '30px' }}
        />
      </>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const { query } = context;
  const name = query.name || '';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const { data: products } = await axios.get(
      `${apiBaseUrl}/api/products?search=${encodeURIComponent(name)}&per_page=100`
    );
    
    return {
      props: {
        products: products || [],
        search: name,
      },
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      props: {
        products: [],
        search: name,
      },
    };
  }
}
