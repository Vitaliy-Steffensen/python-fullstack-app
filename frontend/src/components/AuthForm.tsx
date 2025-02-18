import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const authSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

interface Props {
  route: string;
  method: 'login' | 'register';
}

const AuthForm = ({ route, method }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validation = authSchema.safeParse({ username, password });
    if (!validation.success) {
      setError(validation.error.errors.map((err) => err.message).join(', '));
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(route, { username, password });
      if (method === 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1>{method}</h1>
          <div>
            <label htmlFor="" className="block text-sm/6 font-medium text-gray-900">
              username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <div>
            <label htmlFor="" className="block text-sm/6 font-medium text-gray-900">
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <button
            type="submit"
            className="focus-visible:outline-indigo-60 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {method}
          </button>
          {loading && 'Loading...'}
          {error && <div className="text-sm text-red-500">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
