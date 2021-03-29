import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import ChirpList from "../components/ChirpList"
import ChirpForm from "../components/ChirpForm";
import getDate from "../../javascripts/currentDate";
import sortDate from '../../javascripts/sortDate'
import { AuthContext } from '../../shared/context/auth-context';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

import './ChirpApp.css';

function ChirpApp() {
    const auth = useContext(AuthContext);

    const initialChirps = [
        { id: 1, info: 'Clean Fishtank', replies: [{ yuri: 'hello' }], rechirps: 0, rechirpId: 0, likes: 0, date: '1/1/21' },
        { id: 2, info: 'Wash Car', replies: [], rechirps: 0, rechirpId: 0, likes: 0, date: '1/10/21' },
        { id: 3, info: 'Grow Beard', replies: [], rechirps: 0, rechirpId: 0, likes: 0, date: '1/2/21' }
    ]

    //object, setState for Object, set inital state
    const [chirps, setChirps] = useState()
    const [isLoading, setLoading] = useState(true);

    const fetchChirps = async () => {
        setLoading(true);
        try {
            await axios.get('http://localhost:5000/chirps')
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                        setChirps(response.data);
                        setLoading(false);
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }


        // sortDate();
    }

    useEffect(() => {
        // Update chirps on refresh
        fetchChirps();

    }, []);

    useEffect(() => {
        // sort chirps from newest to oldest
        if (chirps) {
            console.log('sorted from newest to oldest!')
            sortDate(chirps)
        }

    }, [isLoading, chirps]); //run when changes to isLoading or chirps

    // const addChirp = newChirp => {
    //     setChirps([...chirps, { id: uuidv4(), info: newChirp, replies: [], rechirps: 0, rechirpId: 0, likes: 0, date: getDate() }])
    // }

    // const removeChirp = chirpId => {
    //     const updatedChirps = chirps.filter(c => c.id !== chirpId);
    //     setChirps(updatedChirps);
    // }

    const removeChirp = async (chirpId) => {
        const authorizationToken = localStorage.getItem('token');
        const headers = {
            Authorization: authorizationToken
        }
        const data = {
            id: chirpId
        }
        try {
            await axios.delete('http://localhost:5000/chirps', { headers, data })
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        fetchChirps();
                        console.log(response.data)
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const likeChirp = chirpId => {
        let toggleLike = chirps.map(c => (
            c.id === chirpId ? { ...c, likes: c.likes + 1 } : c
        ))
        setChirps(toggleLike);
    }

    const reChirp = chirpId => {
        let newChirps = [];
        for (let chirp of chirps) {
            if (chirp.id === chirpId) {
                //give it a new id
                let newId = { ...chirp, id: uuidv4(), rechirpId: chirpId }
                newChirps.push(newId)
            }
        }
        setChirps([...chirps, ...newChirps]);

        // let duplicate = chirps.map(c => (
        //     c.id === chirpId ? { ...c, id: uuidv4() } : c
        // ))
        // setChirps([...chirps,...duplicate]);
    }

    // const addReply = (chirpId, value) => {
    //     let reply = chirps.map(c => (
    //         c.id === chirpId ? { ...c, replies: value } : c
    //     ))
    //     console.log(chirpId, value);
    //     setChirps(reply);
    //     // console.log('hello')
    // }

    return (
        <div className="ChirpApp">
            {isLoading && <CircularIndeterminate/>}
            {/* {!isLoading && { sortDate() }} */}
            {auth.isLoggedIn &&
                <ChirpForm fetchChirps={fetchChirps} />}
            {!isLoading && <ChirpList
                allChirps={chirps}
                removeChirp={removeChirp}
                likeChirp={likeChirp}
                reChirp={reChirp}
                // addReply={addReply}
            />}
        </div>
    );
}


export default ChirpApp;