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

    const fetchSingleChirp = async () => {
        setLoading(true);
        //if reply fetch the thread and display the whole thread
        //else do below
        try {
            const res = await axios.get(`http://localhost:5000/${userId}/status/${chirpId}`, { params: { id: chirpId } })
                .then(response => {

                    if (response.status === 200) {
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

    useEffect(() => {
        if (loadedChirp && loadedChirp.isReply) {
            fetchParentChirp()
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