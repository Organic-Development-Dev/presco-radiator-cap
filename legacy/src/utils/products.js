const fetchAttributesWithTermByCategoryId = (products) => {
  let attributesMap = {};
  products?.forEach((product) => {
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
