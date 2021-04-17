import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Chirp from "../components/Chirp";
import ChirpReply from "../components/ChirpReply";
import ChirpReplyForm from "../components/ChirpReplyForm";
import { useParams, useHistory, useLocation } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'

import useToggleState from "../../hooks/useToggleState";

function ChirpDetail(props) {
    const { chirpId, userId } = useParams()
    const [loadedChirp, setLoadedChirp] = useState();
    const [loadedParent, setLoadedParent] = useState();
    const [isLoading, setLoading] = useState(true);
    const history = useHistory();
    const location = useLocation();
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

    const fetchParentChirp = async () => {
        setLoading(true);
        //if reply fetch the thread and display the whole thread
        //else do below
        try {
            const res = await axios.get(`http://localhost:5000/${loadedChirp.parentUsername}/status/${loadedChirp.parentChirpId}`, { params: { id: loadedChirp.parentChirpId } })
                .then(response => {

                    if (response.status === 200) {
                        console.log(response.data)
                        setLoadedParent(response.data);
                        setLoading(false);
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

    //reload chirps when one is clicked on
    useEffect(() => {
        fetchSingleChirp();
    }, [location]);


    // useEffect(() => {
    //     // sort chirps from newest to oldest
    //     if (loadedChirp) {
    //         console.log('Chirp is loaded.')
    //         console.log(loadedChirp.replies)
    //     }
    // }, [isLoading, loadedChirp]); //run when changes to isLoading or chirps

    useEffect(() => {
        if (loadedChirp && loadedChirp.isReply) {
            fetchParentChirp()
        }
    }, [loadedChirp])

    return (
        <div>
            {/* display parent chirp */}
             {!isLoading && loadedParent && loadedParent.id !== loadedChirp.id && <Chirp
                username={loadedParent.author.username}
                date={loadedParent.date}
                id={loadedParent.id}
                likes={loadedParent.likes}
                replies={loadedParent.replies}
                text={loadedParent.text}
                // removeChirp={removeChirp}
                parentChirpId={loadedParent.parentChirpId}
                parentUsername={loadedParent.parentUsername}
                author={loadedParent.author}
            />}

            {/* display loaded Chirp */}
            {!isLoading && loadedChirp && <Chirp
                username={loadedChirp.author.username}
                date={loadedChirp.date}
                id={loadedChirp.id}
                likes={loadedChirp.likes}
                replies={loadedChirp.replies}
                text={loadedChirp.text}
                // removeChirp={removeChirp}
                parentChirpId={loadedChirp.parentChirpId}
                parentUsername={loadedChirp.parentUsername}
                author={loadedChirp.author}
            />}

            {/* display loaded Chirp replies */}
            {!isLoading && loadedChirp && loadedChirp.replies.map(c => (
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
                    detailView={true}
                    author={c.author}
                />
            ))}
            {isLoading && <CircularIndeterminate />}
        </div>
    );
}

export default ChirpDetail;