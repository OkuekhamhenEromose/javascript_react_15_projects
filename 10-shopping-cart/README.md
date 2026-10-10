# Project 10 — Shopping Cart

**Difficulty:** Intermediate-Advanced
**Concepts:** immutable updates to NESTED state, fully derived pricing.

## Folder structure
```
10-shopping-cart/
├── ShoppingCart.jsx          Correct - immutable cart item updates
├── ShoppingCart.test.jsx     6 tests
├── ShoppingCartBuggy.jsx     Mutates state directly (intentional bug)
├── ShoppingCartBuggy.test.jsx PROVES mutation is invisible to React
└── productData.js            Shared catalog data (also used by Project 5)
```

## Data model — deliberately minimal

```js
cartItem = { productId, quantity }   // NOT the full product object
```
Storing only an id + quantity (not a copy of name/price) avoids a second
source of truth that could drift if the catalog's price ever changed.
Full display data is looked up from the catalog at render time.

## The single most repeated lesson in this entire React section

`ShoppingCartBuggy.jsx`:
```js
function handleAddToCart(productId) {
  const existing = cartItems.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;      // BUG: mutates the object directly
    setCartItems(cartItems);     // BUG: SAME array reference passed back
  }
  ...
}
```
**Proven live:** the array genuinely IS mutated (length really does change
internally) — but React's change detection is REFERENCE-based
(`Object.is` comparison), not value-based. Passing back the same array
reference means React sees "no change" and never re-renders, even though
the underlying data changed. This is the exact same mechanism as
`00-react-foundations/CounterBuggy.jsx` and `01-counter-dashboard`'s lesson,
now at higher structural complexity (an array of objects, not a single value).

**The fix (`ShoppingCart.jsx`):** always build a genuinely NEW array/object:
```js
setCartItems(items.map((item) =>
  item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
));
```
