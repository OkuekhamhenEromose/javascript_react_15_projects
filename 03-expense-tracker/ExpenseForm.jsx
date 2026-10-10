import { useState } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedDescription = description.trim();
    const numericAmount = Number(amount);

    if (trimmedDescription === '') {
      setError('Description is required.');
      return;
    }
    if (amount.trim() === '' || Number.isNaN(numericAmount)) {
      setError('Amount must be a valid number.');
      return;
    }
    if (numericAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setError('');
    onAddExpense({ description: trimmedDescription, amount: numericAmount, category });
    setDescription('');
    setAmount('');
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="expense-description">Description</label>
      <input id="expense-description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label htmlFor="expense-amount">Amount</label>
      <input id="expense-amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

      <label htmlFor="expense-category">Category</label>
      <select id="expense-category" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}
      <button type="submit">Add expense</button>
    </form>
  );
}

export default ExpenseForm;

// 20 errors
