import React, { useState, useContext } from 'react';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';


function Login(props) {
    // const { loginUser } = props;
    const auth = useContext(AuthContext);

    const [value, handleChange, reset] = useInputState("");
    const [value2, handleChange2, reset2] = useInputState("");

    function loginUser(username, password) {
        try {
          const data = {
            username,
            password
          }
          axios.post('http://localhost:5000/auth/login', data)
            .then(response => {
              console.log(response.data.username)
              if (response.status === 200) {
                auth.login(response.data.username)
              }
          })
        } catch (error) {
          console.log(error)
        }
      }
    

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                loginUser(value,value2)
                // addChirp(value);
                reset();
                reset2();
            }}
        >
            <label htmlFor="username">Username</label>
            <input
                type='text'
                name='username'
                onChange={handleChange}
                value={value}
                id='username'
                placeholder='Enter username'
            />
            <label htmlFor="password">Password</label>
            <input
                type='password'
                name='password'
                onChange={handleChange2}
                value={value2}
                id='password'
                placeholder='Enter password'
            />
            <button>Login</button>
        </form>
    );
}


export default Login;