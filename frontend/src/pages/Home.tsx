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
      <div className="flex w-full max-w-lg items-start space-x-4 rounded-lg border p-4 shadow-sm focus-within:border-blue-500">
        <img
          className="w-10"
          src="https://yt3.googleusercontent.com/R1vlhyGLOoLp2Ygon20Xm960qKA3nY85fPUB7jRyyjaU3Wl6J2nQCNYrFm8dta1CeuLT-5tP=s900-c-k-c0x00ffffff-no-rj"
          alt=""
        />

        <form onSubmit={createNote}>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
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
            </div>
            <div>
              <label htmlFor="content">Content:</label>
              <br />
              <textarea
                className="w-full rounded-lg border border-none p-2 focus:ring focus:ring-0 focus:ring-blue-200 focus:outline-none"
                id="content"
                name="content"
                required
                onChange={(e) => setContent(e.target.value)}
                value={content}
                rows={4}
                cols={50}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                disabled={!content.trim()}
                value="submit"
                className="focus-visible:outline-indigo-60 bg-primary-500 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
