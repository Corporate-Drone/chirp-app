import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import ChirpReplyForm from "./ChirpReplyForm";
import useToggleState from "../../hooks/useToggleState";
import getDate from "../../javascripts/currentDate";



function ChirpReply(props) {
    const { date, id, likes, text, likeChirp, username, parentUsername, parentChirpId, replies } = props;
    const [isReplying, toggle] = useToggleState(false);
    const { chirpId, userId } = useParams()

    const history = useHistory();

    const removeReply = async (replyId, parentChirpId) => {
        const authorizationToken = localStorage.getItem('token');
        const headers = {
            Authorization: authorizationToken
        }
        const data = {
            id: replyId,
            chirpId: parentChirpId
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
            <Link to={`/${username}/status/${id}`}>
                <p>Replying to {parentUsername}</p>
                <p>{username}</p>
                <p>{date}</p>
                <p>{text}</p>
                <p>{replies.length} {likes.length}</p>
            </Link>
            {/* <button onClick={toggle}>Reply</button>
            <button onClick={() => reChirp(id)}>Rechirp</button>
            <button onClick={() => removeChirp(id)}>Remove</button>
            <button onClick={() => likeChirp(id)}>Like</button>
            {isReplying && <ChirpReplyForm id={id} addReply={addReply} />} */}
            <button>Like</button>
            <button onClick={() => removeReply(id,parentChirpId)}>Remove</button>
            <hr />

        </div>
    );
}

export default ChirpReply;