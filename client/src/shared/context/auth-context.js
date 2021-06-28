import { createContext } from 'react';

export const AuthContext = createContext({
  jwtToken: localStorage.getItem('token'),
  isLoggedIn: false,
  username: null,
  userId: null,
  login: () => {},
  logout: () => {}
});
