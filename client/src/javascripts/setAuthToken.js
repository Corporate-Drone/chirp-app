import axios from 'axios';

//added token to headers if exists, delete if it doesn't
const setAuthToken = token => {
  if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
