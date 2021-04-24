import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import ChirpList from "../components/ChirpList"
import ChirpForm from "../components/ChirpForm";
import sortDate from '../../javascripts/sortDate'
import { AuthContext } from '../../shared/context/auth-context';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

import './ChirpApp.css';

function ChirpApp() {
    const auth = useContext(AuthContext);
    const history = useHistory();

    if (!auth.isLoggedIn) {
        history.push('/');
    }

    const [chirps, setChirps] = useState()
    const [isLoading, setLoading] = useState(true);

    const fetchChirps = async () => {
        setLoading(true);
        try {
            if (auth.isLoggedIn) {
                await axios.get('http://localhost:5000/chirps', { params: { userId: auth.userId } })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response.data)
                        setChirps(response.data);
                        setLoading(false);
                    }
                })
            }

        } catch (error) {
            console.log(error)
            setLoading(false);
        }
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

    return (
        <div className="ChirpApp">
            {isLoading && <CircularIndeterminate/>}
            {auth.isLoggedIn &&
                <ChirpForm fetchChirps={fetchChirps} />}
            {!isLoading && <ChirpList
                allChirps={chirps}
                fetchChirps={fetchChirps}
            />}
        </div>
    );
}


export default ChirpApp;