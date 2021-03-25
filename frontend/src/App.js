import React, { useState, useCallback, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useHistory } from 'react-router-dom';

import Login from './user/pages/Login';
import Register from './user/pages/Register';

import { AuthContext } from './shared/context/auth-context';
import Navbar from './shared/components/Navigation/Navbar';
import ChirpList from "./chirps/components/ChirpList"
import ChirpDetail from "./chirps/pages/ChirpDetail"
import ChirpApp from './chirps/pages/ChirpApp';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback(uid => {   //useCallback prevents rerender (not recreated)
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/chirps" exact>
          <ChirpApp />
        </Route>
        <Route path="/chirps/:userId/:chirpId" exact>
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
        <Route path="/chirps/:userId/:chirpId" exact>
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
      value={{ isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout }}
    >
      <Router>
        <Navbar />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;