import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import './App.css';

// Redux Slice for Cart Management
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: []
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    }
  }
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

// Configure Redux Store
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer
  }
});

// Products data
const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 45 }
];

// Product Card Component
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
};

// Products Section Component
const ProductsSection = () => {
  return (
    <div className="products-section">
      <h2 className="section-title">Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <div className="cart-item">
      <span className="cart-item-name">
        {item.name} (${item.price})
      </span>
      <input
        type="number"
        value={item.quantity}
        onChange={handleQuantityChange}
        min="1"
        className="quantity-input"
      />
      <button onClick={handleRemove} className="remove-btn">
        Remove
      </button>
    </div>
  );
};

// Shopping Cart Component
const ShoppingCart = () => {
  const cartItems = useSelector(state => state.cart.items);

  return (
    <div className="shopping-cart">
      <h2 className="section-title">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="app-container">
      <h1 className="main-title">My Shop</h1>
      <ProductsSection />
      <ShoppingCart />
    </div>
  );
};

// Root Component with Redux Provider
export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}