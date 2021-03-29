import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Chirp from "../components/Chirp";
import ChirpReply from "../components/ChirpReply";
import ChirpReplyForm from "../components/ChirpReplyForm";
import { useParams, useHistory } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

import useToggleState from "../../hooks/useToggleState";

function ChirpDetail(props) {
    const { chirpId, userId } = useParams()
    const [loadedChirp, setLoadedChirp] = useState();
    const [isLoading, setLoading] = useState(true);
    const history = useHistory();

    const fetchSingleChirp = async () => {
        setLoading(true);

        try {
            const res = await axios.post(`http://localhost:5000/${userId}/status/${chirpId}`, {
                id: chirpId
            })
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                        setLoadedChirp(response.data);
                        setLoading(false);
                        console.log('request made!')
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    useEffect(() => {
        // Update chirps on refresh
        fetchSingleChirp();

    }, []);


    useEffect(() => {
        // sort chirps from newest to oldest
        if (loadedChirp) {
            console.log('Chirp is loaded.')
            console.log(loadedChirp.replies)
        }
    }, [isLoading, loadedChirp]); //run when changes to isLoading or chirps

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
        history.push('/chirps');
    }

    const removeReply = async (replyId) => {
        const authorizationToken = localStorage.getItem('token');
        const headers = {
            Authorization: authorizationToken
        }
        const data = {
            id: replyId,
            chirpId: chirpId
        }
        try {
            await axios.delete(`http://localhost:5000/${userId}/status/${chirpId}/reply`, { headers, data })
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        history.push('/chirps');
    }


    return (
        <div>
            {loadedChirp && <Chirp
                username={loadedChirp.author.username}
                date={loadedChirp.date}
                id={loadedChirp.id}
                likes={loadedChirp.likes}
                replies={loadedChirp.replies}
                text={loadedChirp.text}
                removeChirp={removeChirp}
            />}
            {loadedChirp && loadedChirp.replies.map(c => (
                // <div>{c.author.username}</div>
                <ChirpReply
                    key={c._id}
                    username={c.author.username}
                    date={c.date}
                    text={c.text}
                    likes={c.likes}
                    id={c._id}
                    userId={c.author._id}
                    removeReply={removeReply}
                />
            ))}
            {loadedChirp && loadedChirp.replies.length == 0 && <div>This chirp has no replies yet. Be the first to reply!</div>}
            {isLoading && <CircularIndeterminate/>}
        </div>
    );
}

export default ChirpDetail;