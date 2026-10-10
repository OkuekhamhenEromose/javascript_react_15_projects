import { useLocalStorageState } from './useLocalStorageState';
import ExpenseForm from './ExpenseForm';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';

let nextId = 1;

function ExpenseTracker() {
  const [expenses, setExpenses] = useLocalStorageState('expenses', []);

  function handleAddExpense(expenseData) {
    setExpenses([...expenses, { id: nextId++, ...expenseData }]);
  }

  function handleDelete(id) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  return (
    <div>
      <h1>Expense Tracker</h1>
      <ExpenseForm onAddExpense={handleAddExpense} />
      <ExpenseSummary expenses={expenses} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
}

export default ExpenseTracker;

// 9 errors
