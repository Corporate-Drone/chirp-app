import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import ChirpList from "../components/ChirpList"
import ChirpForm from "../components/ChirpForm";
import getDate from "../../javascripts/currentDate";

import './ChirpApp.css';

function ChirpApp() {
    const initialChirps = [
        { id: 1, info: 'Clean Fishtank', replies: [{ yuri: 'hello' }], rechirps: 0, rechirpId: 0, likes: 0, date: '1/1/21' },
        { id: 2, info: 'Wash Car', replies: [], rechirps: 0, rechirpId: 0, likes: 0, date: '1/10/21' },
        { id: 3, info: 'Grow Beard', replies: [], rechirps: 0, rechirpId: 0, likes: 0, date: '1/2/21' }
    ]

    //object, setState for Object, set inital state
    const [chirps, setChirps] = useState(initialChirps)

    function sortDate() {
        chirps.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        })
    }

    const addChirp = newChirp => {
        setChirps([...chirps, { id: uuidv4(), info: newChirp, replies: [], rechirps: 0, rechirpId: 0, likes: 0, date: getDate() }])
    }

    const removeChirp = chirpId => {
        const updatedChirps = chirps.filter(c => c.id !== chirpId);
        setChirps(updatedChirps);
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

    const addReply = (chirpId, value) => {
        let reply = chirps.map(c => (
            c.id === chirpId ? { ...c, replies: value } : c
        ))
        console.log(chirpId, value);
        setChirps(reply);
        // console.log('hello')
    }

    return (
        <div className="ChirpApp">
            {sortDate()}
            <ChirpForm addChirp={addChirp} />
            <ChirpList
                allChirps={chirps}
                removeChirp={removeChirp}
                likeChirp={likeChirp}
                reChirp={reChirp}
                addReply={addReply}
            />
        </div>
    );
}


export default ChirpApp;