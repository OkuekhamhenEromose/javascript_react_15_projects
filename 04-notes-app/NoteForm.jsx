// import { useState, useEffect } from 'react';

// function NoteForm({ onSave, editingNote, onCancelEdit }) {
//   const [title, setTitle] = useState('');
//   const [body, setBody] = useState('');

//   // Sync the form fields whenever a DIFFERENT note starts being edited -
//   // this is the fix for the exact stale-draft bug from Project 2, applied via useEffect this time.
//   useEffect(() => {
//     if (editingNote) {
//       setTitle(editingNote.title);
//       setBody(editingNote.body);
//     } else {
//       setTitle('');
//       setBody('');
//     }
//   }, [editingNote]);

//   function handleSubmit(event) {
//     event.preventDefault();
//     if (title.trim() === '') return;
//     onSave({ title: title.trim(), body: body.trim() });
//     setTitle('');
//     setBody('');
//   }

//   return (
//     <form onSubmit={handleSubmit} noValidate>
//       <label htmlFor="note-title">Title</label>
//       <input id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} />

//       <label htmlFor="note-body">Body</label>
//       <textarea id="note-body" value={body} onChange={(e) => setBody(e.target.value)} />

//       <button type="submit">{editingNote ? 'Save changes' : 'Add note'}</button>
//       {editingNote && <button type="button" onClick={onCancelEdit}>Cancel</button>}
//     </form>
//   );
// }

// export default NoteForm;


// 12 errors







































import { useState, useEffect } from "react";

function NoteForm({onSave, onEditing, onCancelEdit}){
const [title, setTitle] = useState("")
const [body, setBody] = useState('')

useEffect(()=>{
  if(onEditing){
    setTitle(onEditing.title)
    setBody(onEditing.body)
  }else{
    setTitle("")
    setBody("")
  }
}, [onEditing])

function handleSubmit(e){
  e.preventDefault()
  if(title.trim()=== '')return
  onSave({title: title.trim(), body: body.trim()})
  setBody("")
  setTitle("")
}

return(
  <form onSubmit={handleSubmit} noValidate>
    <label htmlFor="note-title" id={title}> Title </label>
    <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} />
    <label htmlFor="note-body" id={body}> Body </label>
    <input type="text" value={body} onChange={(e)=> setBody(e.target.value)} />

    <button type="submit"> {onEditing ? 'Save Note' : 'Edit Note'} </button>
    {onEditing && <button type="button" onClick={onCancelEdit}> Cancel </button> }
  </form>
)
}
export default NoteForm
