function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <ul>
      {sortedNotes.map((note) => (
        <li key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.body}</p>
          <button onClick={() => onEdit(note)}>Edit</button>
          <button onClick={() => onDelete(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
// 5 errors
