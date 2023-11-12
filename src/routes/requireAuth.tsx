import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
import { RootState, resetStore } from '../store';
// import { webRoutes } from './web';
import { useCallback } from 'react';
import { apiRoutes } from './api';
// import { handleNotiResponse } from '../utils';
import { updateProfile } from '../store/slices/profile';
import http from '../utils/http';
export type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const dispatch = useDispatch();

  const admin = useSelector((state: RootState) => state.admin);

  // const location = useLocation();
  const handleGetProfile = useCallback(async () => {
    try {
      const data = await http.get(apiRoutes.me);
      if (data.data) {
        dispatch(updateProfile(data.data));
      } else {
        dispatch(resetStore());
      }
    } catch (error) {
      dispatch(resetStore());
    }
  }, []);
  if (!admin || !admin.token) {
    // return <Navigate to={webRoutes.login} state={{ from: location }} replace />;
    dispatch(resetStore());
    location.href = '/login';
    return <></>;
  } else {
    handleGetProfile();
  }

  return children;
};

export default RequireAuth;
