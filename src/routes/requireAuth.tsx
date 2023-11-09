import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../store';
import { webRoutes } from './web';
import { useEffect } from 'react';

export type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const admin = useSelector((state: RootState) => state.admin);

  const state = useSelector((state: RootState) => state);

  const location = useLocation();
  useEffect(() => {
    console.log('state', state);
  }, []);
  if (!admin) {
    // return <Navigate to={webRoutes.login} state={{ from: location }} replace />;
    window.location.href = '/login';
  }

  return children;
};

export default RequireAuth;
