import { useState } from 'react';
import { PRODUCTS } from './productData';

const TAX_RATE = 0.08;

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]); // [{ productId, quantity }]

  function getProduct(productId) {
    return PRODUCTS.find((p) => p.id === productId);
  }

  function handleAddToCart(productId) {
    setCartItems((items) => {
      const existing = items.find((item) => item.productId === productId);
      if (existing) {
        return items.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { productId, quantity: 1 }];
    });
  }

  function handleUpdateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      setCartItems((items) => items.filter((item) => item.productId !== productId));
      return;
    }
    setCartItems((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
    );
  }

  function handleRemove(productId) {
    setCartItems((items) => items.filter((item) => item.productId !== productId));
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + product.price * item.quantity;
  }, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price.toFixed(2)}
            <button onClick={() => handleAddToCart(product.id)}>Add to cart</button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => {
            const product = getProduct(item.productId);
            return (
              <li key={item.productId}>
                {product.name} — ${product.price.toFixed(2)} x
                <button aria-label={`Decrease ${product.name}`} onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</button>
                <span data-testid={`quantity-${item.productId}`}>{item.quantity}</span>
                <button aria-label={`Increase ${product.name}`} onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
                <button onClick={() => handleRemove(item.productId)}>Remove</button>
              </li>
            );
          })}
        </ul>
      )}

      <p data-testid="subtotal">Subtotal: ${subtotal.toFixed(2)}</p>
      <p data-testid="tax">Tax: ${tax.toFixed(2)}</p>
      <p data-testid="total">Total: ${total.toFixed(2)}</p>
    </div>
  );
}

export default ShoppingCart;
