import React, { useState, useCallback, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';

import Login from './user/pages/Login';
import Register from './user/pages/Register';
import UserChirps from './user/pages/UserChirps'
import UserSetup from './user/pages/UserSetup';
import UserFollow from './user/pages/UserFollow';

import { AuthContext } from './shared/context/auth-context';
import Header from './shared/components/Navigation/Navbar-Responsive';
import ChirpDetail from "./chirps/pages/ChirpDetail"
import ChirpApp from './chirps/pages/ChirpApp';
import Home from './chirps/pages/Home';

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
        <Route path="/:userId/followers" exact>
          <UserFollow type={"followers"}/>
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
          <ChirpApp />
        </Route>
        <Route path="/:userId" exact>
          <UserChirps />
        </Route>
        <Route path="/:userId/followers" exact>
          <UserFollow type={"followers"}/>
        </Route >
        <Route path="/:userId/following" exact>
          <UserFollow type={"following"} />
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
        <Header/>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
