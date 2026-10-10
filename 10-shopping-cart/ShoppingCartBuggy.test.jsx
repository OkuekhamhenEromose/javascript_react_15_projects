import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShoppingCartBuggy from './ShoppingCartBuggy';

test('DEBUGGING EXERCISE: mutating state directly fails to update the UI, even though the data changed', async () => {
  const user = userEvent.setup();
  render(<ShoppingCartBuggy />);

  expect(screen.getByTestId('item-count')).toHaveTextContent('0 item(s) in cart');

  await user.click(screen.getByText(/Add Wireless Mouse/));

  console.log('Item count display after adding one item:', screen.getByTestId('item-count').textContent);
  // The array WAS mutated (cartItems.length is genuinely 1 internally), but React
  // never re-rendered, because setCartItems received the SAME array reference back.
  expect(screen.getByTestId('item-count')).toHaveTextContent('0 item(s) in cart'); // still shows 0!
});
