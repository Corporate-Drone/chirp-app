import React, { useState, useContext } from 'react';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import getDate from "../../javascripts/currentDate";
import { AuthContext } from '../../shared/context/auth-context';

function ChirpForm(props) {
    // const { addChirp } = props;
    const auth = useContext(AuthContext);

    // const addChirp = newChirp => {
    //     setChirps([...chirps, {info: newChirp, replies: [], rechirps: [], likes: 0, date: getDate() }])
    // }

    const addChirp = newChirp => {
        // setChirps([...chirps, { info: newChirp, replies: [], rechirps: [], likes: 0, date: getDate() }])
        try {
            const data = {
                text: newChirp,
                replies: [],
                likes: [],
                date: getDate(),
                author: auth.userId
            }
            axios.post('http://localhost:5000/chirps', data)
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }

    const [value, handleChange, reset] = useInputState("");
    return (
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addChirp(value);
                    reset();
                }}
            >
                <input
                    type='text'
                    name='info'
                    onChange={handleChange}
                    value={value}
                    id='info'
                    placeholder='What is happening?'
                />
                <button>Send Chirp</button>
            </form>
    );
}


export default ChirpForm;