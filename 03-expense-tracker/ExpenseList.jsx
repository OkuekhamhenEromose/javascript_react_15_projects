// function ExpenseList({ expenses, onDelete }) {
//   if (expenses.length === 0) {
//     return <p>No expenses recorded yet.</p>;
//   }

//   return (
//     <ul>
//       {expenses.map((expense) => (
//         <li key={expense.id}>
//           {expense.description} — ${expense.amount.toFixed(2)} ({expense.category})
//           <button onClick={() => onDelete(expense.id)}>Delete</button>
//         </li>
//       ))}
//     </ul>
//   );
// }

// export default ExpenseList;


// 6 errors





































function ExpenseList({expenses, onDelete}){
if(expenses.length === 0){
  <p>There is no amount here</p>
}
return (
  <div>
    <ul>
      
    </ul>
  </div>
)
}
export default ExpenseList
