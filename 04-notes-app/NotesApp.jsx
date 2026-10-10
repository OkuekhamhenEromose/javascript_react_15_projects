import { useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import SearchBar from './SearchBar';
import NoteForm from './NoteForm';
import NoteList from './NoteList';

let nextId = 1;

function NotesApp() {
  const [notes, setNotes] = useLocalStorageState('notes', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  function handleSave(noteData) {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === editingNote.id ? { ...n, ...noteData, updatedAt: Date.now() } : n)));
      setEditingNote(null);
    } else {
      setNotes([...notes, { id: nextId++, ...noteData, updatedAt: Date.now() }]);
    }
  }

  function handleDelete(id) {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingNote?.id === id) setEditingNote(null); // don't leave a stale edit open on a deleted note
  }

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query);
  });

  return (
    <div>
      <h1>Notes</h1>
      <SearchBar onDebouncedSearchChange={setSearchQuery} />
      <NoteForm onSave={handleSave} editingNote={editingNote} onCancelEdit={() => setEditingNote(null)} />
      <NoteList notes={filteredNotes} onEdit={setEditingNote} onDelete={handleDelete} />
    </div>
  );
}

export default NotesApp;















































// import {useState} from "react"

// import {useLocalStorageState} from "./useLocalStorageState";
// import NoteForm from "./NoteForm"
// import NoteList from "./NoteList"
// import SearchBar from "./SearchBar"

// let nextId = 1

// function NotesApp() {
//   const [notes, setNotes] = useLocalStorageState('notes', [])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [editingNote, setEditingNote] = useState(null)

//   function handleSave(noteData) {
//     if (editingNote) {
//       setNotes(notes.map((n)=>(n.id === editingNote.id ?{...n, ...noteData, updatedAt: Date.now()}:n)))
//       setEditingNote(null)
//     }else{
//       setNotes([...notes, {id: nextId, ...noteData, updatedAt: Date.now()}])*
//     }
//   }
//   function handleDelete(id) {
//     setNotes(notes.filter((n)=> n.id !== id))
//     if (editingNote?.id === id) return*
//   }
//   const filteredNotes = notes.filter((note)=>{
//     const query = setSearchQuery.note.toLower()
//     note.title.toLower().includes(query) || note.body.toLower().includes(quiery)
//   })
//   return (*
//     <SearchBar onDebouncedSearchChange={setSearchQuery}/>
//     <NoteForm onSave= {handleSave} editingNote={editingNote} onCancelEdit={()=> setEditingNote(null)} />
//     <NoteList notes={filteredNotes} onEdit={setEditingNote(null)} onDelete={handleDelete} />
//   )

// }
