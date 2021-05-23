import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import ChirpReplyForm from "./ChirpReplyForm";
import useToggleState from "../../hooks/useToggleState";
import getDate from "../../javascripts/currentDate";
import { AuthContext } from '../../shared/context/auth-context';
import avatarplaceholder from '../../images/avatarplaceholder.gif'
import ReplyIcon from '@material-ui/icons/Reply';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import './Chirp.css'


function Chirp(props) {
    const { replies, date, id, likes, text, username, isReply, parentChirpId, parentUsername, detailView, author, fetchChirps } = props;
    const [isReplying, toggle] = useToggleState(false);
    const [isLiked, toggleLike] = useToggleState();
    const [likeCount, setLikeCount] = useState();

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
                    if (response.status === 200) {
                        console.log('request made!')
                    }
                })
        } catch (error) {
            console.log(error)
        }
        if (fetchChirps) {
            //refresh Chirps if on /chirps
            fetchChirps();
        } else {
            //redirect to the thread containing the reply
            history.push(`/${username}/status/${chirpId}/`);
        }
    }

    const likeChirp = async (chirpId) => {
        try {
            await axios.post(`http://localhost:5000/${username}/status/${chirpId}/like`, {
                id: chirpId,
                username: auth.username
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log('Chirp liked!')
                    }
                })
        } catch (error) {
            console.log(error)
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
                        console.log('Chirp removed!')
                    }
                })
        } catch (error) {
            console.log(error)
        }
        //run function if fetchChirps was passed down from ChirpApp or redirect to /chirps if deleted from Chirp detail
        if (fetchChirps) {
            fetchChirps();
        } else {
            history.push('/chirps');
        }
    }

    useEffect(() => {
        if (auth.isLoggedIn && likes.includes(auth.userId)) {
            toggleLike()
        }

        setLikeCount(likes.length);
    }, [])

    const handleLikeButton = async (chirpId) => {
        if (isLiked) {
            setLikeCount(likeCount - 1)
        } else {
            setLikeCount(likeCount + 1)
        }
        likeChirp(chirpId)
        toggleLike()

    }

    //display placeholder image if user has not uploaded a picture
    let profilePicture;
    if (!author.image || author.image.url === undefined) {
        profilePicture = (
            <img src={avatarplaceholder} width="100" height="100" />
        )
    } else {
        profilePicture = (
            <img src={author.image.url} width="100" height="100" />
        )
    }

    let replyUsername;
    if (isReply && detailView) {
        replyUsername = (
            <div className="Chirp-container">
                <Link to={`/${username}`} className="Chirp-picture">
                    <div>{profilePicture}</div>
                </Link>
                <div className="top">
                    <div className="username-date">
                        <Link to={`/${username}`} className="Chirp-username">
                            <div>{username}</div>
                        </Link>
                        <Link to={`/${username}/status/${id}`}>
                            <div>{date.slice(0, 9)}</div>
                        </Link>
                    </div>
                    <Link to={`/${parentUsername}`}>
                        <div id="Chirp-replying">Replying to {parentUsername}</div>
                    </Link>
                    <Link to={`/${username}/status/${id}`} id="Chirp-text">
                        <p>{text}</p>
                    </Link>
                </div>
            </div>
        )
    } else if (isReply) {
        replyUsername = (
            <div className="Chirp-container">
                <Link to={`/${username}`} className="Chirp-picture">
                    <div>{profilePicture}</div>
                </Link>
                <div className="top">
                    <div className="username-date">
                        <Link to={`/${username}`} className="Chirp-username">
                            <div>{username}</div>
                        </Link>
                        <Link to={`/${username}/status/${id}`}>
                            <div>{date.slice(0, 9)}</div>
                        </Link>
                    </div>
                    <Link to={`/${parentUsername}`}>
                        <div id="Chirp-replying">Replying to {parentUsername}</div>
                    </Link>
                    <Link to={`/${username}/status/${id}`} id="Chirp-text">
                        <p>{text}</p>
                    </Link>
                </div>
            </div>
        )
    } else if (parentUsername) {
        replyUsername = (
            <div className="Chirp-container">
                <Link to={`/${username}`} className="Chirp-picture">
                    <div>{profilePicture}</div>
                </Link>
                <div className="top">
                    <div className="username-date">
                        <Link to={`/${username}`} className="Chirp-username">
                            <div>{username}</div>
                        </Link>
                        <Link to={`/${username}/status/${id}`}>
                            <div>{date.slice(0, 9)}</div>
                        </Link>
                    </div>
                    <Link to={`/${parentUsername}`}>
                        <div id="Chirp-replying">Replying to {parentUsername}</div>
                    </Link>
                    <Link to={`/${username}/status/${id}`} id="Chirp-text">
                        <p>{text}</p>
                    </Link>
                </div>
            </div>
        )
    } else { //don't display any parent info
        replyUsername = (
            <div className="Chirp-container">
                <Link to={`/${username}`} className="Chirp-picture">
                    <div>{profilePicture}</div>
                </Link>
                <div className="top">
                    <div className="username-date">
                        <Link to={`/${username}`} className="Chirp-username">
                            <div>{username}</div>
                        </Link>
                        <Link to={`/${username}/status/${id}`}>
                            <div>{date.slice(0, 9)}</div>
                        </Link>
                    </div>
                    <Link to={`/${username}/status/${id}`} id="Chirp-text">
                        <p>{text}</p>
                    </Link>
                </div>
            </div>
        )
    }



    //display remove button if Chirp belongs to current user
    let removeButton;
    if (username === auth.username) {
        removeButton = (
            <button className="Chirp-remove" onClick={() => removeChirp(id)}><DeleteIcon /></button>
        )
    }

    return (
        <div>
            <div className="Chirp">
                {replyUsername}
                <div className="Chirp-buttons">
                    <div>
                        <button className="Chirp-reply" onClick={toggle}><ReplyIcon /> {replies.length}</button>
                    </div>
                    <div>
                        {removeButton}
                    </div>
                    <div>
                        {!isLiked && <button className="not-liked like-button" onClick={() => handleLikeButton(id)}><FavoriteBorderOutlinedIcon /> {likeCount}</button>}
                    </div>
                    <div>
                        {isLiked && <button id="liked" className="like-button" onClick={() => handleLikeButton(id)}><FavoriteOutlinedIcon /> {likeCount}</button>}
                    </div>
                </div>
            </div>
            {isReplying && <ChirpReplyForm id={id} addReply={addReply} />}
            {/* <hr /> */}
        </div>
    );
}

export default Chirp;
