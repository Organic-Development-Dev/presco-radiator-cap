// sort.js

/**
 * Function to sort products alphabetically and numerically.
 * @param {Array} products - Array of product objects.
 * @returns {Array} - Sorted array of products.
 */
export function sortProducts(products) {
    return products.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
  
      // Extract numbers from the product names for comparison
      const extractNumber = (str) => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
  
      // Compare alphabetically first
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
  
      // If names are the same, compare numerically
      const numA = extractNumber(nameA);
      const numB = extractNumber(nameB);
  
      return numA - numB;
    });
  }
  