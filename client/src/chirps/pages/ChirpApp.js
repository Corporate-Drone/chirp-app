import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import ChirpList from "../components/ChirpList"
import ChirpForm from "../components/ChirpForm";
import { AuthContext } from '../../shared/context/auth-context';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

import './ChirpApp.css';

function ChirpApp() {
    const auth = useContext(AuthContext);

    const [chirps, setChirps] = useState()
    const [isLoading, setLoading] = useState(true);

    const fetchChirps = async () => {
        setLoading(true);
        try {
            if (auth.isLoggedIn) {
                await axios.get('/chirps', { params: { userId: auth.userId } })
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
        fetchChirps()
    }, [auth])


    let noChirps;
    if (chirps && chirps.length === 0) {
        noChirps = (<div className="ChirpApp-noChirps">There are no chirps to display! Follow more users to see chirps. </div>)
    }

    return (
        <div className="ChirpApp">
            {isLoading && <CircularIndeterminate />}
            {auth.isLoggedIn && !isLoading &&
                <ChirpForm fetchChirps={fetchChirps} />}
            {!isLoading && <ChirpList
                allChirps={chirps}
                fetchChirps={fetchChirps}
            />}
            {!isLoading && noChirps}
        </div>
    );
}


export default ChirpApp;