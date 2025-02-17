import { useEffect, useState } from 'react';
import api from '../api';
import Note from '../components/Note';

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get('api/notes/')
      .then((res) => res.data)
      .then((data) => setNotes(data))
      .catch((error) => alert(error));
  };

  const deleteNote = (id: number) => {
    api
      .delete(`/api/notes/delete/${id}`)
      .then((res) => {
        if (res.status === 204) alert('Note deleted!');
        else alert('Failed to delete note.');
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post('api/notes/', { content, title })
      .then((res) => {
        if (res.status === 201) alert('Note created!');
        else alert('Failed to make note.');
        getNotes();
      })
      .catch((error) => alert(error));
  };

  return (
    <div>
      <h2>Notes</h2>
      {notes.map((note) => (
        <Note note={note} onDelete={deleteNote} key={note.id} />
      ))}
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
          rows={4}
          cols={50}
        />
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};

export default Home;
