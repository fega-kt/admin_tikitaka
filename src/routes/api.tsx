import { API_URL, API_URL_AUTH } from '../utils';

export const apiRoutes = {
  login: `${API_URL_AUTH}/login`,
  me: `${API_URL_AUTH}/me`,
  logout: `${API_URL}/logout`,
  users: `${API_URL}/users`,
  reviews: `${API_URL}/unknown`,
  upload: `${API_URL}/upload`,
};
