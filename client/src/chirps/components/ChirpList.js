import React from "react";
import Chirp from "./Chirp";
import sortDate from '../../javascripts/sortDate'

function ChirpList(props) {
    const { allChirps, removeChirp, addReply, fetchChirps } = props;
    sortDate(allChirps);
    const chirps = allChirps.map(c => (
        <Chirp
            key={c.id} {...c}
            removeChirp={removeChirp}
            addReply={addReply}
            username={c.author.username}
            author={c.author}
            fetchChirps={fetchChirps}
            
        />
    ))

    return (
        <div>
            {chirps}
        </div>
    );
}


export default ChirpList;