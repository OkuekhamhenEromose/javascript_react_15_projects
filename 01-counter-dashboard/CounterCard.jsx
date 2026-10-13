// function CounterCard({ counter, onIncrement, onDecrement, onRemove }) {
//   return (
//     <div data-testid={`counter-${counter.id}`}>
//       <h3>{counter.name}</h3>
//       <p aria-live="polite">Count: {counter.count}</p>
//       <button aria-label={`Decrement ${counter.name}`} onClick={() => onDecrement(counter.id)}>
//         -
//       </button>
//       <button aria-label={`Increment ${counter.name}`} onClick={() => onIncrement(counter.id)}>
//         +
//       </button>
//       <button aria-label={`Remove ${counter.name}`} onClick={() => onRemove(counter.id)}>
//         Remove
//       </button>
//     </div>
//   );
// }

// export default CounterCard;
























function CounterCard({counter, onIncrement, onDecrement, onRemove}){
return (
  <div dataset-id={`Counter -${counter.id}`}>
    <h3> {counter.name} </h3>
    <p> {counter.count} </p>
    <button aria-label= {`Decrease - $ {counter.name} `} onClick={()=> onDecrement(counter.id) } >Decrease</button>
    <button aria-label= {`Increase - $ {counter.name} `} onClick={()=> onIncrement(counter.id) } >Increase</button>
    <button aria-label= {`Remove - $ {counter.name} `} onClick={()=> onRemove(counter.id) } >Remove</button>

  </div>
)
}
export default CounterCard;
