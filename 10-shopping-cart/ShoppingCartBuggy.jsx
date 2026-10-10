import { useState } from 'react';
import { PRODUCTS } from './productData';

// INTENTIONAL BUG: mutates the existing array/objects instead of creating new ones.
function ShoppingCartBuggy() {
  const [cartItems, setCartItems] = useState([]);

  function handleAddToCart(productId) {
    const existing = cartItems.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += 1; // BUG: mutates the object directly
      setCartItems(cartItems); // BUG: passes the SAME array reference back - React sees "no change"
    } else {
      cartItems.push({ productId, quantity: 1 }); // BUG: mutates the array directly
      setCartItems(cartItems); // same array reference again
    }
  }

  return (
    <div>
      {PRODUCTS.slice(0, 1).map((product) => (
        <button key={product.id} onClick={() => handleAddToCart(product.id)}>
          Add {product.name}
        </button>
      ))}
      <p data-testid="item-count">{cartItems.length} item(s) in cart</p>
    </div>
  );
}

export default ShoppingCartBuggy;
