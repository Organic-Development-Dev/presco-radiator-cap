import axios from 'axios';
import dynamic from 'next/dynamic';
import {useState, useEffect} from "react";
import {Pagination} from "antd";
import { useRouter } from 'next/router';

const SearchPage = dynamic(() => import('../../src/components/SearchPage'), {
  ssr: false,
});

function Index({ products: initialProducts, search: initialSearch }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);
  const [dataProducts, setDataProducts] = useState(initialProducts);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  
  // Update products when URL changes
  useEffect(() => {
    const currentSearchTerm = router.query.name || '';
    if (currentSearchTerm !== search) {
      fetchProducts(currentSearchTerm);
    }
  }, [router.query.name]);
  
  const fetchProducts = async (searchTerm) => {
    setLoading(true);
    try {
      const apiBaseUrl = window.location.origin;
      console.log('Fetching products for:', searchTerm);
      const { data: products } = await axios.get(
        `${apiBaseUrl}/api/products?search=${encodeURIComponent(searchTerm)}&per_page=100`
      );
      console.log('Fetched products:', products);
      setDataProducts(products || []);
      setSearch(searchTerm);
      setCurrentPage(1);
    } catch (error) {
      console.error('Search error:', error);
      setDataProducts([]);
    }
    setLoading(false);
  };
  
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
        <SearchPage products={currentProducts} search={search} loading={loading} />
        {!loading && dataProducts.length > 0 && (
          <Pagination
              current={currentPage}
              total={dataProducts.length}
              pageSize={productsPerPage}
              onChange={paginate}
              style={{ textAlign: 'center', marginBottom: '30px' }}
          />
        )}
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
