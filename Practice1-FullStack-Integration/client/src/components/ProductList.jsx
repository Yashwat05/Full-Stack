import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make GET request to Express API
      const response = await axios.get('http://localhost:5000/api/products');
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Product List</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">Price: ${product.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;