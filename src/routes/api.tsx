import { API_URL, API_URL_AUTH } from '../utils';

export const apiRoutes = {
  login: `${API_URL_AUTH}/login`,
  logout: `${API_URL}/logout`,
  users: `${API_URL}/users`,
  reviews: `${API_URL}/unknown`,
};
