import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShoppingCart from './ShoppingCart';

test('adding a product to the cart shows it with quantity 1', async () => {
  const user = userEvent.setup();
  render(<ShoppingCart />);

  const mouseRow = screen.getByText(/Wireless Mouse/).closest('li');
  await user.click(within(mouseRow).getByText('Add to cart'));

  expect(screen.getByTestId('quantity-1')).toHaveTextContent('1');
  expect(screen.getByTestId('subtotal')).toHaveTextContent('Subtotal: $25.99');
});

test('adding the SAME product twice increments quantity instead of duplicating the row', async () => {
  const user = userEvent.setup();
  render(<ShoppingCart />);

  const mouseRow = screen.getByText(/Wireless Mouse/).closest('li');
  await user.click(within(mouseRow).getByText('Add to cart'));
  await user.click(within(mouseRow).getByText('Add to cart'));

  expect(screen.getByTestId('quantity-1')).toHaveTextContent('2');
  expect(screen.getAllByTestId(/quantity-/)).toHaveLength(1); // still ONE row, not two
});

test('increment/decrement buttons update quantity and totals correctly', async () => {
  const user = userEvent.setup();
  render(<ShoppingCart />);

  const mouseRow = screen.getByText(/Wireless Mouse/).closest('li');
  await user.click(within(mouseRow).getByText('Add to cart'));

  await user.click(screen.getByLabelText('Increase Wireless Mouse'));
  await user.click(screen.getByLabelText('Increase Wireless Mouse'));
  expect(screen.getByTestId('quantity-1')).toHaveTextContent('3');
  expect(screen.getByTestId('subtotal')).toHaveTextContent('Subtotal: $77.97');

  await user.click(screen.getByLabelText('Decrease Wireless Mouse'));
  expect(screen.getByTestId('quantity-1')).toHaveTextContent('2');
});

test('decrementing to zero removes the item entirely', async () => {
  const user = userEvent.setup();
  render(<ShoppingCart />);

  const mouseRow = screen.getByText(/Wireless Mouse/).closest('li');
  await user.click(within(mouseRow).getByText('Add to cart'));
  await user.click(screen.getByLabelText('Decrease Wireless Mouse'));

  expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
});

test('adding TWO different products only affects each ones own quantity and correctly sums totals', async () => {
  const user = userEvent.setup();
  render(<ShoppingCart />);

  const mouseRow = screen.getByText(/Wireless Mouse/).closest('li'); // $25.99
  const beltRow = screen.getByText(/Leather Belt/).closest('li'); // $30.00

  await user.click(within(mouseRow).getByText('Add to cart'));
  await user.click(within(beltRow).getByText('Add to cart'));
  await user.click(screen.getByLabelText('Increase Leather Belt'));

  expect(screen.getByTestId('quantity-1')).toHaveTextContent('1'); // mouse unaffected
  expect(screen.getByTestId('quantity-4')).toHaveTextContent('2'); // belt is product id 4

  const expectedSubtotal = 25.99 + 30.0 * 2;
  expect(screen.getByTestId('subtotal')).toHaveTextContent(`Subtotal: $${expectedSubtotal.toFixed(2)}`);
});

test('tax and total are correctly derived from subtotal', async () => {
  const user = userEvent.setup();
  render(<ShoppingCart />);

  const mouseRow = screen.getByText(/Wireless Mouse/).closest('li'); // $25.99
  await user.click(within(mouseRow).getByText('Add to cart'));

  const expectedTax = 25.99 * 0.08;
  const expectedTotal = 25.99 + expectedTax;
  expect(screen.getByTestId('tax')).toHaveTextContent(`Tax: $${expectedTax.toFixed(2)}`);
  expect(screen.getByTestId('total')).toHaveTextContent(`Total: $${expectedTotal.toFixed(2)}`);
});
