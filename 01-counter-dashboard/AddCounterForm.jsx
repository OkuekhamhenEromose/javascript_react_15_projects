import { useState } from 'react';

function AddCounterForm({ onAddCounter }) {
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName === '') return; // guard clause - don't add blank counters
    onAddCounter(trimmedName);
    setName(''); // clear the field after a successful add
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-counter-name">New counter name</label>
      <input
        id="new-counter-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Water glasses"
      />
      <button type="submit">Add counter</button>
    </form>
  );
}

export default AddCounterForm;


// 70%
