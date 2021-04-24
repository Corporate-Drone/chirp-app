import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

function Home() {
    const auth = useContext(AuthContext);
    const history = useHistory();

    return (
        <div>
            <h1>Happening Now</h1>
            <h2>Join Chirp today.</h2>
            <Link to="auth/register">
                <button>Register</button>
            </Link>
            <Link to="auth/login">
                <button>Login</button>
            </Link>
        </div>
    )
}

export default Home;