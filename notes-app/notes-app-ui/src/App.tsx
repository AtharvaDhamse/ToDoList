import React, { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string
}

const App = () => {
  const [notes, setNotes] = useState
  <Note[]
  >([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [selectedNotes, setSelectedNote] = useState<Note | null>(null)

  useEffect(()=>{
    const fetchNotes = async() => {
      try {
        const response = await fetch("http://localhost:5000/api/notes")  

        const notes: Note[] = await response.json()

        setNotes(notes)
      } 
      catch (error) {
        console.log(error)
      }
    };

    fetchNotes();
  }, []);

  const handleNoteClick = (note:Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleAddNote = async (event: React.FormEvent) => {

    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content
        })
      })

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } 
    catch (error) {
      console.log(error)
    }
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if(!selectedNotes)
    {
      return;
    }

    try {

      const response = await fetch(`http://localhost:5000/api/notes/${selectedNotes.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      })

      const updatedNotes = await response.json();
      const updatedNotesList = notes.map((note)=>
      note.id === selectedNotes.id ? updatedNotes : note
    );

      setNotes(updatedNotesList)
      setTitle("")
      setContent("")
      setSelectedNote(null);
    } 
    catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
      setTitle("")
      setContent("")
      setSelectedNote(null);
    }

  const deleteNote = async (event: React.MouseEvent, noteId: number) =>{
    event.stopPropagation();

    try {

      await fetch(`http://localhost:5000/api/notes/${noteId}`,
      {
        method: "DELETE",
      })

      const updatedNotes = notes.filter((note)=> note.id !== noteId)
      setNotes(updatedNotes); 
    } 
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='app-container'>
      <form className='app-form' onSubmit={(event) => selectedNotes ? handleUpdateNote(event) : handleAddNote(event)}>
        <input value={title} onChange={(e)=> setTitle(e.target.value)}
          placeholder='Title' 
          required>
        </input>
        <textarea value={content} onChange={(e)=> setContent(e.target.value)}
          placeholder='Content...' 
          rows={10} 
          required>
        </textarea>

          {
            selectedNotes ? (
              <div className='edit-buttons'>
                <button type='submit'>Save</button>
                <button type='submit' onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <button type='submit'>Add Note</button>
            )
          }

      </form>
      <div className='notes-grid'>
        {notes.map((note)=> (
          <div className='notes-item' onClick={()=> handleNoteClick(note)}>
            <div className='notes-header'>
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
        
      </div>
    </div>
  )
}

export default App;