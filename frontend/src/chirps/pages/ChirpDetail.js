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
    // const { parentUsername, parentChirpId } = props;

    const fetchSingleChirp = async () => {
        setLoading(true);
        //if reply fetch the thread and display the whole thread
        //else do below
        try {
            const res = await axios.get(`http://localhost:5000/${userId}/status/${chirpId}`, { params: { id: chirpId } })
                .then(response => {
                    
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


    return (
        <div>
            {loadedChirp && <Chirp
                username={loadedChirp.author.username}
                date={loadedChirp.date}
                id={loadedChirp.id}
                likes={loadedChirp.likes}
                replies={loadedChirp.replies}
                text={loadedChirp.text}
                // removeChirp={removeChirp}
                parentChirpId={loadedChirp.parentChirpId}
                parentUsername={loadedChirp.parentUsername}
            />}
            {loadedChirp && loadedChirp.replies.map(c => (
                // <div>{c.author.username}</div>
                // <ChirpReply
                //     key={c._id}
                //     username={c.author.username}
                //     date={c.date}
                //     text={c.text}
                //     likes={c.likes}
                //     replies={c.replies}
                //     id={c._id}
                //     userId={c.author._id}
                //     // removeReply={removeReply}
                //     parentUsername={c.parentUsername}
                //     parentChirpId={c.parentChirpId}
                //     isReply={c.isReply}
                // />
                <Chirp
                key={c._id}
                username={c.author.username}
                date={c.date}
                text={c.text}
                likes={c.likes}
                replies={c.replies}
                id={c._id}
                userId={c.author._id}
                // removeReply={removeReply}
                parentUsername={c.parentUsername}
                parentChirpId={c.parentChirpId}
                isReply={c.isReply}
            />
            ))}
            {/* {loadedChirp && loadedChirp.replies.length == 0 && <div>This chirp has no replies yet. Be the first to reply!</div>} */}
            {isLoading && <CircularIndeterminate/>}
        </div>
    );
}

export default ChirpDetail;