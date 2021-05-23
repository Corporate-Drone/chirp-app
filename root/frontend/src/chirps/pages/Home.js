import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import './Home.css';

function Home() {
    const auth = useContext(AuthContext);
    const history = useHistory();

    return (
        <div className="Background">
            <div className="Home">
                <div className="Home-titles">
                    <h1>Happening Now</h1>
                    <h2>Join Chirp today.</h2>
                </div>

                <Link to="auth/register">
                    <button>Register</button>
                </Link>
                <Link to="auth/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;