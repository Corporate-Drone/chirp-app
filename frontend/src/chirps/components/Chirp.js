import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import ChirpReplyForm from "./ChirpReplyForm";
import useToggleState from "../../hooks/useToggleState";
import getDate from "../../javascripts/currentDate";


function Chirp(props) {
    const { replies, date, id, likes, rechirps, text, removeChirp, likeChirp, reChirp, username } = props;
    const [isReplying, toggle] = useToggleState(false);

    const history = useHistory();

    const addReply = async (chirpId, value) => {
        try {
            const res = await axios.post(`http://localhost:5000/${username}/status/${chirpId}/reply`, {
                id: chirpId,
                text: value,
                username: username,
                date: getDate()
            })
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                        console.log('request made!')
                    }
                })
        } catch (error) {
            console.log(error)
        }
        history.push('/chirps');
    }

    // const username = author.username;
    // const [isReplying, setReplying] = useState(false);

    // function reply() {
    //     setReplying(true);
    // }

    return (
        <div>
            <Link to={`/${username}/status/${id}`}>
                <p>{username}</p>
                <p>{date}</p>
                <p>{text}</p>
                <p>{replies.length} {rechirps} {likes.length}</p>
            </Link>
            <button onClick={toggle}>Reply</button>
            <button onClick={() => reChirp(id)}>Rechirp</button>
            <button onClick={() => removeChirp(id)}>Remove</button>
            <button onClick={() => likeChirp(id)}>Like</button>
            {isReplying && <ChirpReplyForm id={id} addReply={addReply} />}
            <hr />

        </div>
    );
}

export default Chirp;