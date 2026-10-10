// const FILTERS = ['all', 'active', 'completed'];

// function TodoFilter({ currentFilter, onFilterChange }) {
//   return (
//     <div role="group" aria-label="Filter todos">
//       {FILTERS.map((filter) => (
//         <button
//           key={filter}
//           aria-pressed={currentFilter === filter}
//           onClick={() => onFilterChange(filter)}
//         >
//           {filter}
//         </button>
//       ))}
//     </div>
//   );
// }

// export default TodoFilter;











































const FILTERS = ["all", "active", "completed"];

funtion TodoFilter ({currentFilter, onFilterChange}){

  FILTERS.map((filter) => {
    return (
      <div aria-label={filter} role="group">
        <button aria-pressed={currentFilter === filter} key={filter} onClick={()=> onFilterChange(filter)}>
        {filter}
        </button>
      </div>
    );
  });
}
export default TodoFilter;
