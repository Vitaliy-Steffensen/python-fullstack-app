import { Navigate } from 'react-router-dom';
import { ReactNode, FC } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface Props {
  element: ReactNode;
}

export const AuthRoute: FC<Props> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default AuthRoute;
