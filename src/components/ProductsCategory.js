// src/components/ProductsCategory.js

import { useEffect, useState } from 'react';
import { sortProducts } from '../utils/sort';
import DrawerFilterProduct from './DrawerFilterProduct';

export default function ProductsCategory(props) {
  const { dataCategory, products } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dataProducts, setDataProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);

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

  const handleFilterAndSort = (selectedFilters, sortOrder) => {
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

    const sorted = sortProducts(filtered, sortOrder);
    setDataProducts(sorted);
    setOpenDrawer(false);
  };

  // Rest of the component...

  return (
    <>
      {/* Rest of the component... */}
      {products.length > 0 && (
        <DrawerFilterProduct
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          handlerFilter={handleFilterAndSort} // Pass the updated handler function
          products={products}
        />
      )}
    </>
  );
}
