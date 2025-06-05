import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import './App.css';

const plantsData = [
  { id: 1, name: 'Snake Plant', price: 15, category: 'Indoor', image: '/images/snake.jpg' },
  { id: 2, name: 'Aloe Vera', price: 12, category: 'Succulents', image: '/images/aloe.jpg' },
  { id: 3, name: 'Peace Lily', price: 20, category: 'Indoor', image: '/images/lily.jpg' },
  { id: 4, name: 'Cactus', price: 10, category: 'Succulents', image: '/images/cactus.jpg' },
  { id: 5, name: 'Fern', price: 18, category: 'Outdoor', image: '/images/fern.jpg' },
  { id: 6, name: 'Bamboo', price: 25, category: 'Outdoor', image: '/images/bamboo.jpg' },
];

function App() {
  const [cart, setCart] = useState({});

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const updateCart = (id, qty) => {
    if (qty <= 0) {
      const newCart = { ...cart };
      delete newCart[id];
      setCart(newCart);
    } else {
      setCart(prev => ({ ...prev, [id]: qty }));
    }
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalCost = Object.entries(cart).reduce((sum, [id, qty]) => sum + plantsData.find(p => p.id === +id).price * qty, 0);

  return (
    <Router>
      <div>
        <Header totalItems={totalItems} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductListing plants={plantsData} addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} plants={plantsData} updateCart={updateCart} totalCost={totalCost} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Header({ totalItems }) {
  return (
    <header className="header">
      <Link to="/" className="logo">GreenLeaf</Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-icon">
          <ShoppingCart />
          <span className="cart-count">{totalItems}</span>
        </Link>
      </div>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="landing">
      <h1>Welcome to GreenLeaf</h1>
      <p>We provide the best selection of houseplants to brighten your home and purify your air.</p>
      <Link to="/products" className="btn">Get Started</Link>
    </div>
  );
}

function ProductListing({ plants, addToCart }) {
  const categories = [...new Set(plants.map(p => p.category))];
  return (
    <div className="product-listing">
      {categories.map(cat => (
        <div key={cat}>
          <h2>{cat}</h2>
          <div className="product-grid">
            {plants.filter(p => p.category === cat).map(plant => (
              <div key={plant.id} className="product-card">
                <img src={plant.image} alt={plant.name} />
                <h3>{plant.name}</h3>
                <p>${plant.price}</p>
                <button onClick={() => addToCart(plant.id)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CartPage({ cart, plants, updateCart, totalCost }) {
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {Object.keys(cart).length === 0 ? <p>Your cart is empty.</p> : (
        <div>
          {Object.entries(cart).map(([id, qty]) => {
            const plant = plants.find(p => p.id === +id);
            return (
              <div key={id} className="cart-item">
                <img src={plant.image} alt={plant.name} />
                <div className="item-details">
                  <h3>{plant.name}</h3>
                  <p>${plant.price} x {qty} = ${plant.price * qty}</p>
                  <div className="qty-controls">
                    <button onClick={() => updateCart(plant.id, qty - 1)}>-</button>
                    <span>{qty}</span>
                    <button onClick={() => updateCart(plant.id, qty + 1)}>+</button>
                    <button onClick={() => updateCart(plant.id, 0)} className="delete">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="cart-summary">
            <p>Total: ${totalCost}</p>
            <div className="cart-buttons">
              <Link to="/products" className="btn">Continue Shopping</Link>
              <button className="btn">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;