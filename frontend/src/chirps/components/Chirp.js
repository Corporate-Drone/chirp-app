import React, { useState, useEffect } from "react";
import ChirpReplyForm from "./ChirpReplyForm";
import useToggleState from "../../hooks/useToggleState";


function Chirp(props) {
    const { replies, date, id, likes, rechirps, text, removeChirp, likeChirp, reChirp, addReply, username } = props;
    const [isReplying, toggle] = useToggleState(false);

    const getUsername = async () => {
        const username = await author.username
    }
    // const username = author.username;
    // const [isReplying, setReplying] = useState(false);

    // function reply() {
    //     setReplying(true);
    // }

    return (
        <div>
            <p>{username}</p>
            <p>{date}</p>
            <p>{text}</p>
            <p>{replies.length} {rechirps} {likes.length}</p>
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