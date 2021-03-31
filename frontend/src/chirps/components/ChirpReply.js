import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import ChirpReplyForm from "./ChirpReplyForm";
import useToggleState from "../../hooks/useToggleState";
import getDate from "../../javascripts/currentDate";



function ChirpReply(props) {
    const { date, id, likes, text, removeChirp, likeChirp, username, removeReply } = props;
    const [isReplying, toggle] = useToggleState(false);

    const history = useHistory();


    return (
        <div>
            <Link to={`/${username}/status/${id}`}>
                <p>Replying to -Username Here-</p>
                <p>{username}</p>
                <p>{date}</p>
                <p>{text}</p>
                <p>{likes.length}</p>
            </Link>
            {/* <button onClick={toggle}>Reply</button>
            <button onClick={() => reChirp(id)}>Rechirp</button>
            <button onClick={() => removeChirp(id)}>Remove</button>
            <button onClick={() => likeChirp(id)}>Like</button>
            {isReplying && <ChirpReplyForm id={id} addReply={addReply} />} */}
            <button>Like</button>
            <button onClick={() => removeReply(id)}>Remove</button>
            <hr />

        </div>
    );
}

export default ChirpReply;