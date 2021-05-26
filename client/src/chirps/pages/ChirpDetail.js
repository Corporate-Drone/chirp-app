import React, { useState, useEffect } from "react";
import axios from 'axios';
import Chirp from "../components/Chirp";
import { useParams, useLocation } from 'react-router-dom';
import CircularIndeterminate from '../../shared/components/UIElements/CircularIndeterminate'


function ChirpDetail(props) {
    const { chirpId, userId } = useParams()
    const [loadedChirp, setLoadedChirp] = useState();
    const [loadedParent, setLoadedParent] = useState();
    const [isLoading, setLoading] = useState(true);
    const location = useLocation();

    const fetchChirp = async (username,chirp,type) => {
        setLoading(true);
        //if reply fetch the thread and display the whole thread
        //else do below
        try {
            const res = await axios.get(`/${username}/status/${chirp}`, { params: { id: chirp } })
                .then(response => {

                    if (response.status === 200) {
                        if (type === "parent") {
                            setLoadedParent(response.data)
                        } else {
                            setLoadedChirp(response.data);
                        }

                    }
                    setLoading(false);
                })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    useEffect(() => {
        // Update chirps on refresh
        fetchChirp(userId, chirpId)
    }, []);

    //reload chirps when one is clicked on
    useEffect(() => {
        fetchChirp(userId, chirpId)
        // fetchSingleChirp();
    }, [location]);

    useEffect(() => {
        if (loadedChirp && loadedChirp.isReply) {
            let parentUsername = loadedChirp.parentUsername;
            let parentChirpId = loadedChirp.parentChirpId;
            fetchChirp(parentUsername, parentChirpId, "parent");
            // fetchParentChirp()
        }
    }, [loadedChirp])

    return (
        <div>
             {!isLoading && loadedParent && loadedParent.id !== loadedChirp.id && <Chirp
                username={loadedParent.author.username}
                date={loadedParent.date}
                id={loadedParent.id}
                likes={loadedParent.likes}
                replies={loadedParent.replies}
                text={loadedParent.text}
                parentChirpId={loadedParent.parentChirpId}
                parentUsername={loadedParent.parentUsername}
                author={loadedParent.author}
            />}

            {!isLoading && loadedChirp && <Chirp
                username={loadedChirp.author.username}
                date={loadedChirp.date}
                id={loadedChirp.id}
                likes={loadedChirp.likes}
                replies={loadedChirp.replies}
                text={loadedChirp.text}
                parentChirpId={loadedChirp.parentChirpId}
                parentUsername={loadedChirp.parentUsername}
                author={loadedChirp.author}
            />}

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