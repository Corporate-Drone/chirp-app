import React, { useState, useCallback, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useHistory } from 'react-router-dom';
import axios from 'axios';

import Login from './user/pages/Login';
import Register from './user/pages/Register';
import UserChirps from './user/pages/UserChirps'
import UserSetup from './user/pages/UserSetup';

import { AuthContext } from './shared/context/auth-context';
import Navbar from './shared/components/Navigation/Navbar';
import ChirpList from "./chirps/components/ChirpList"
import ChirpDetail from "./chirps/pages/ChirpDetail"
import ChirpApp from './chirps/pages/ChirpApp';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);
  const [username, setUsername] = useState(false);

  const login = useCallback((uid, username) => {   //useCallback prevents rerender (not recreated)
    setIsLoggedIn(true);
    setUserId(uid);
    setUsername(username);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
    axios.post('http://localhost:5000/auth/logout')
      .then(response => {
        // console.log(response.data)
        if (response.status === 200) {
          console.log(response.data)
        }
      })
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/chirps" exact>
          <ChirpApp />
        </Route>
        <Route path="/:userId" exact>
          <UserChirps />
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
        <Route path="/chirps" exact>
          <ChirpApp />
        </Route>
        <Route path="/:userId" exact>
          <UserChirps />
        </Route>
        <Route path="/:userId/status/:chirpId" exact>
          <ChirpDetail />
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
      value={{ isLoggedIn: isLoggedIn, userId: userId, username: username, login: login, logout: logout }}
    >
      <Router>
        <Navbar />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
