# React Foundations

The five core mental-model shifts every later project depends on. Each concept
here is proven with a real, rendered, tested component — not just described.

## Files

| File | Concept | What it proves |
|---|---|---|
| `Greeting.jsx` | Components, JSX, props, conditional rendering | Props flow through a destructured parameter; `{cond && <el/>}` uses truthy/falsy rules |
| `Counter.jsx` / `CounterBuggy.jsx` | `useState`, closures | `useState` returns a `const` binding — direct mutation (`count++`) throws immediately rather than silently failing |
| `TaskList.jsx`, `KeyDemo.jsx` | List rendering, keys | `KeyDemo.jsx` contains TWO versions side by side — one keyed by array index, one by stable value — used to prove index-keys cause per-item state to attach to the wrong item after a reorder |
| `SignupForm.jsx` | Controlled inputs, forms | `noValidate` on the `<form>` — required because `<input type="email">`'s native browser validation was found, live, to silently block custom validation logic from ever running |
| `TemperatureConverter.jsx` / `TemperatureConverterBroken.jsx` | Lifting state up | The `Broken` version has two sibling components each with their OWN `useState` — proven unable to sync; the fixed version lifts the shared value to their common parent |

## The `CounterBuggy.jsx` lesson, in the code

```js
const [count, setCount] = useState(0); // count is a CONST binding
function handleIncrement() {
  count++; // TypeError: Assignment to constant variable
}
```
This isn't an accident of React's design — `useState`'s destructuring pattern
deliberately uses `const` so that direct mutation is a loud, immediate crash,
not a silent "why isn't my UI updating" bug.

## The `KeyDemo.jsx` lesson, in the code

Two exported components, `TaskListIndexKey` and `TaskListStableKey`, are
identical except for one line: `key={index}` vs `key={task}`. Run the tests
for both and reorder the underlying array between renders — the index-keyed
version's typed input value ends up attached to the WRONG task after reorder;
the stable-keyed version doesn't.

## Running

```bash
npx vitest run  # from a project with these files in src/
```
