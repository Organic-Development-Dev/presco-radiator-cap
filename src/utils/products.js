import axios from 'axios';

// const fetchAttributes = async () => {
//   const { data } = await axios.get(
//     'http://localhost:3000/api/products/attributes'
//   );
//   return data;
// };

// // options in attributes
// const fetchAttributeTerms = async (attributeId) => {
//   const { data } = await axios.get(
//     `http://localhost:3000/api/products/attributes/${attributeId}/terms`
//   );
//   return data;
// };

// const fetchAttributesWithTerm = async () => {
//   const attributes = await fetchAttributes();

//   const termsRequests = attributes.map((attribute) => {
//     return fetchAttributeTerms(attribute.id);
//   });

//   const termsResponses = await Promise.all(termsRequests);

//   const attributesWithTerms = attributes.map((attribute, index) => {
//     return {
//       ...attribute,
//       terms: termsResponses[index],
//     };
//   });

//   return attributesWithTerms;
// };
const fetchAttributesWithTermByCategoryId = async (categoryId) => {
  const { data: products } = await axios.get(
    `http://localhost:3000/api/products`,
    {
      params: {
        category: categoryId,
      },
    }
  );

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

  return attributesMap;
};

export { fetchAttributesWithTermByCategoryId };
