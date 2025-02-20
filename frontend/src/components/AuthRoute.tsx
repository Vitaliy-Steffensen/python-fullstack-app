import { Navigate } from 'react-router-dom';
import { ReactNode, FC } from 'react';
import { useAuth } from '../contexts/AuthProvider';

interface Props {
  element: ReactNode;
}

export const AuthRoute: FC<Props> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default AuthRoute;
