import React, { useState, useCallback, useEffect, useContext} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useHistory } from 'react-router-dom';
import axios from 'axios';

import Login from './user/pages/Login';
import Register from './user/pages/Register';

import { AuthContext } from './shared/context/auth-context';
import Navbar from './shared/components/Navigation/Navbar';
import ChirpList from "./chirps/components/ChirpList"
import ChirpDetail from "./chirps/pages/ChirpDetail"
import ChirpApp from './chirps/pages/ChirpApp';

import './App.css';

function App() {
  const auth = useContext(AuthContext);
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

  return (
    <AuthContext.Provider //wrapped around all links
      value={{ isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout }}
    >
      <Router>
        <Navbar />
        <Switch>
          <Route path="/chirps" exact>
            <ChirpApp />
          </Route>
          <Route path="/chirps/:userId/:chirpId" exact>
            <ChirpDetail />
          </Route>
          <Route path="/auth/login" exact>
            <Login/>
          </Route>
          <Route path="/auth/register" exact>
            <Register/>
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
