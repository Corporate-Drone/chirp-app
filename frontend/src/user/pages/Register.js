import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';
import useInputState from "../../hooks/useInputState";

function Register(props) {
    // const { registerUser } = props;
    const auth = useContext(AuthContext);

    const [value, handleChange, reset] = useInputState("");
    const [value2, handleChange2, reset2] = useInputState("");
    const [value3, handleChange3, reset3] = useInputState("");

    function registerUser(username, email, password) {
        // const headers = {
        //   'Content-Type': 'application/json',
        // }
        try {
            const data = {
                username,
                email,
                password
            }
            axios.post('http://localhost:5000/auth/register', data)
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        auth.login(response.data) //login user after registering
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
                registerUser(value, value2, value3)
                // addChirp(value);
                reset();
                reset2();
                reset3();
            }}
        >
            <label htmlFor="username">Username</label>
            <input
                type='text'
                name='username'
                onChange={handleChange}
                value={value}
                id='username'
                placeholder='Enter a username'
            />
            <label htmlFor="email">Email</label>
            <input
                type='email'
                name='email'
                onChange={handleChange2}
                value={value2}
                id='email'
                placeholder='Enter an email'
            />
            <label htmlFor="password">Password</label>
            <input
                type='password'
                name='password'
                onChange={handleChange3}
                value={value3}
                id='password'
                placeholder='Enter a password'
            />
            <button>Register</button>
        </form>
    );
}


export default Register;