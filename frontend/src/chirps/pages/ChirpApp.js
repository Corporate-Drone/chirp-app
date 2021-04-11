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

    }


    return (
        <div className="ChirpApp">
            {isLoading && <CircularIndeterminate/>}
            {/* {!isLoading && { sortDate() }} */}
            {auth.isLoggedIn &&
                <ChirpForm fetchChirps={fetchChirps} />}
            {!isLoading && <ChirpList
                allChirps={chirps}
                likeChirp={likeChirp}
                reChirp={reChirp}
                fetchChirps={fetchChirps}
            />}
        </div>
    );
}


export default ChirpApp;