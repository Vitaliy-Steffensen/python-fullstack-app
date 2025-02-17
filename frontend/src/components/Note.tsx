import { FC } from 'react';
import { Note as NoteType } from '../pages/Home';

interface Props {
  note: NoteType;
  onDelete: (id: number) => void;
}

const Note: FC<Props> = ({ note, onDelete }) => {
  const formattedDate = new Date(note.created_at).toLocaleDateString('da-DK');

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onDelete(note.id);
  };

  return (
    <div>
      <p>{note.title}</p>
      <p>{note.content}</p>
      <p>{formattedDate}</p>
      <button onClick={onClick}>Deletee</button>
    </div>
  );
};

export default Note;
