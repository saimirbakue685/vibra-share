// filename: complex_code.js

// This code creates a search engine for a fictional online shopping platform
// It allows users to search for products by various criteria

class Product {
  constructor(name, category, price) {
    this.name = name;
    this.category = category;
    this.price = price;
  }
}

class SearchEngine {
  constructor(products) {
    this.products = products;
  }

  searchByName(keyword) {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  searchByCategory(category) {
    return this.products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  searchByPriceRange(minPrice, maxPrice) {
    return this.products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  searchByMultipleCriteria(keyword, category, minPrice, maxPrice) {
    return this.products.filter(product => (
      product.name.toLowerCase().includes(keyword.toLowerCase()) &&
      product.category.toLowerCase() === category.toLowerCase() &&
      product.price >= minPrice && product.price <= maxPrice
    ));
  }
}

// Sample usage
const products = [
  new Product("Apple iPhone 12", "Electronics", 999),
  new Product("Samsung Galaxy S21", "Electronics", 899),
  new Product("Sony WH-1000XM4", "Electronics", 349),
  new Product("Nike Air Zoom Pegasus", "Shoes", 120),
  new Product("Levi's 501 Jeans", "Clothing", 80),
  // ... add more products here
];

const searchEngine = new SearchEngine(products);

console.log("Search Results:");
console.log("--------------------");
console.log("Search by Name:");
console.log(searchEngine.searchByName("iphone"));
console.log("--------------------");
console.log("Search by Category:");
console.log(searchEngine.searchByCategory("Electronics"));
console.log("--------------------");
console.log("Search by Price Range:");
console.log(searchEngine.searchByPriceRange(100, 500));
console.log("--------------------");
console.log("Search by Multiple Criteria:");
console.log(
  searchEngine.searchByMultipleCriteria("Nike", "Shoes", 100, 150)
);
console.log("--------------------");

// ... more complex logic, functionality, and user interaction can be added to the code