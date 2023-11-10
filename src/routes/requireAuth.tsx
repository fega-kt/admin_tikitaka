import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../store';
// import { webRoutes } from './web';
import { useCallback } from 'react';
import { apiRoutes } from './api';
// import { handleErrorResponse } from '../utils';
import axios from 'axios';
import { logout } from '../store/slices/adminSlice';
import { updateProfile } from '../store/slices/profile';

export type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const dispatch = useDispatch();

  const admin = useSelector((state: RootState) => state.admin);

  // const location = useLocation();
  const handleGetProfile = useCallback(() => {
    axios
      .get(apiRoutes.me, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch(updateProfile(response.data));
        } else {
          dispatch(updateProfile(null));
          dispatch(logout());
        }
      })
      .catch(function () {
        dispatch(logout());
      });
  }, []);
  if (!admin || !admin.token) {
    // return <Navigate to={webRoutes.login} state={{ from: location }} replace />;
    window.location.href = '/login';
  } else {
    handleGetProfile();
  }

  return children;
};

export default RequireAuth;
