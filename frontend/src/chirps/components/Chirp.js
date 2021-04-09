import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import ChirpReplyForm from "./ChirpReplyForm";
import useToggleState from "../../hooks/useToggleState";
import getDate from "../../javascripts/currentDate";
import { AuthContext } from '../../shared/context/auth-context';
import avatarplaceholder from '../../images/avatarplaceholder.gif'


function Chirp(props) {
    const { replies, date, id, likes, rechirps, text, reChirp, username, isReply, parentChirpId, parentUsername, detailView, author } = props;
    const [isReplying, toggle] = useToggleState(false);

    const auth = useContext(AuthContext);


    const history = useHistory();

    const addReply = async (chirpId, value) => {
        try {
            const res = await axios.post(`http://localhost:5000/${username}/status/${chirpId}/reply`, {
                id: chirpId,
                text: value,
                username: auth.username,
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

    const likeChirp = async (chirpId) => {
        try {
            await axios.post(`http://localhost:5000/${username}/status/${chirpId}/like`, {
                id: chirpId,
                username: auth.username
            })
                .then(response => {
                    // console.log(response.data)
                    if (response.status === 200) {
                        console.log(response.data)
                    }
                })
        } catch (error) {

        }
    }

    const removeChirp = async (chirpId) => {
        const authorizationToken = localStorage.getItem('token');
        const headers = {
            Authorization: authorizationToken
        }
        const data = {
            id: chirpId,
            chirpId: parentChirpId,
            isReply: isReply
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

    let replyUsername;
    if (isReply && detailView) {
        replyUsername = (
            <div className="container">
            <Link to={`/${username}/status/${id}`}>
              <p>{date}</p>
              <p>{text}</p>
              <p>{replies.length} {likes.length}</p>
            </Link>
            <Link to={`/${parentUsername}`}>
              <p>Replying to {parentUsername}</p>
            </Link>
            <Link to={`/${username}`}>
              <p>{username}</p>
            </Link>
          </div>
        )
    } else if (isReply) {
        replyUsername = (
            <div className="container">
            <Link to={`/${parentUsername}/status/${parentChirpId}`}>
              <p>{date}</p>
              <p>{text}</p>
              <p>{replies.length} {likes.length}</p>
            </Link>
            <Link to={`/${parentUsername}`}>
              <p>Replying to {parentUsername}</p>
            </Link>
            <Link to={`/${username}`}>
              <p>{username}</p>
            </Link>
          </div>
        )
    } else if (parentUsername) {
        replyUsername = (
            <div className="container">
            <Link to={`/${username}/status/${id}`}>
              <p>{date}</p>
              <p>{text}</p>
              <p>{replies.length} {likes.length}</p>
            </Link>
            <Link to={`/${parentUsername}`}>
              <p>Replying to {parentUsername}</p>
            </Link>
            <Link to={`/${username}`}>
              <p>{username}</p>
            </Link>
          </div>
        )
    } else { //don't display any parent info
        replyUsername = (
            <div className="container">
            <Link to={`/${username}/status/${id}`}>
              <p>{date}</p>
              <p>{text}</p>
              <p>{replies.length} {likes.length}</p>
            </Link>
            <Link to={`/${username}`}>
              <p>{username}</p>
            </Link>
          </div>
        )
    }

    let profilePicture;
    if (!author.image) {
        profilePicture = (
            // <img src="https://html.sammy-codes.com/images/small-profile.jpeg"></img>
            <img src={avatarplaceholder} width="100" height="100"></img>
        )
    } else {
        profilePicture = (
            <img src={author.image.url}></img>
        )
    }

    return (
        <div>
            {profilePicture}
            {replyUsername}
            <button onClick={toggle}>Reply</button>
            {/* <button onClick={() => reChirp(id)}>Rechirp</button> */}
            <button onClick={() => removeChirp(id)}>Remove</button>
            <button onClick={() => likeChirp(id)}>Like</button>
            {isReplying && <ChirpReplyForm id={id} addReply={addReply} />}
            <hr />

        </div>
    );
}

export default Chirp;
