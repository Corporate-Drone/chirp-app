import React, { useState, useCallback, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';

import Login from './user/pages/Login';
import Register from './user/pages/Register';
import UserChirps from './user/pages/UserChirps'
import UserSetup from './user/pages/UserSetup';
import UserFollow from './user/pages/UserFollow';
import Users from './user/pages/Users';

import { AuthContext } from './shared/context/auth-context';
import setAuthToken from './javascripts/setAuthToken';
import Header from './shared/components/Navigation/Navbar-Responsive';
import ChirpDetail from "./chirps/pages/ChirpDetail"
import ChirpApp from './chirps/pages/ChirpApp';
import Home from './chirps/pages/Home';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token); //set token for header
  console.log('token set!')
}


function App() {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);
  const [username, setUsername] = useState(false);
  const [jwtToken, setJwttoken] = useState(false);

  const login = useCallback((uid, username, token) => {   //useCallback prevents rerender (not recreated)
    setIsLoggedIn(true);
    setUserId(uid);
    setUsername(username);
    localStorage.setItem('token', token);
    setAuthToken(localStorage.token);
    setJwttoken(token);

  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
    setJwttoken(null);
    axios.post('/auth/logout')
      .then(response => {
        if (response.status === 200) {
          console.log(response.data)
        }
      })
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      await axios.get('/auth')
      .then(response => {
        if (response.status === 200) {
          login(response.data._id, response.data.username, auth.jwtToken)
        }
      })
    }

    loadUser()
  
  }, [])

  let routes;

  if (localStorage.token) {
    routes = (
      <Switch>
        <Route path="/chirps" exact>
          <ChirpApp />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/:userId" exact>
          <UserChirps />
        </Route>
        <Route path="/:userId/followers" exact>
          <UserFollow type={"followers"} />
        </Route >
        <Route path="/:userId/following" exact>
          <UserFollow type={"following"} />
        </Route>
        <Route path="/auth/setup" exact>
          <UserSetup />
        </Route>
        <Route path="/:userId/status/:chirpId" exact>
          <ChirpDetail />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/chirps" exact>
          <Redirect to="/" />
        </Route>
        <Route path="/auth/login" exact>
          <Login />
        </Route>
        <Route path="/auth/register" exact>
          <Register />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider //wrapped around all links
      value={{ jwtToken: jwtToken, isLoggedIn: isLoggedIn, userId: userId, username: username, login: login, logout: logout }}
    >
      <Router>

        <Header />
        <main className="App">{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
