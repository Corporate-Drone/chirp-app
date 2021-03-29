import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useInputState from "../../hooks/useInputState";
import { AuthContext } from '../../shared/context/auth-context';
import { useParams, useHistory } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'
import Chirp from '../../chirps/components/Chirp';
import sortDate from '../../javascripts/sortDate'

function UserChirps(props) {
    const { userId } = useParams()
    const [loadedChirps, setLoadedChirps] = useState();
    const [isLoading, setLoading] = useState(true);

    const getUserChirps = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/:userId", { params: { id: userId } })
                .then(response => {
                    
                    if (response.status === 200) {
                        setLoadedChirps(response.data)
                        console.log(response.data)
                    }
                })
        } catch (error) { console.log(error) }

        setLoading(false);
    }

    useEffect(() => {
        // Update chirps on refresh
        getUserChirps(userId);

    }, []);
    


    useEffect(() => {
        // sort chirps from newest to oldest
        if (loadedChirps) {
            console.log('Chirps are loaded.')
        }
    }, [isLoading, loadedChirps]); //run when changes to isLoading or chirps

    let chirps;
    if (loadedChirps) {
        chirps = loadedChirps.map(c => (
            <Chirp
                key={c.id}
                {...c}
                username={c.author.username}
            />
        ))
        sortDate(loadedChirps)
    }

    return (
        <div>
            {isLoading && <CircularIndeterminate />}
            {!isLoading && <div>{chirps}</div>}
        </div>
    )
}

export default UserChirps;

//post request (userId from params):
//get user information
//get all chirps & replies created User