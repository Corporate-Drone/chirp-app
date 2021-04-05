import React from "react";
import Chirp from "./Chirp";


function ChirpList(props) {
    const { allChirps, removeChirp, reChirp, addReply } = props;
    const chirps = allChirps.map(c => (
        <Chirp
            key={c.id} {...c}
            removeChirp={removeChirp}
            reChirp={reChirp}
            addReply={addReply}
            username={c.author.username}
            
        />
    ))

    return (
        <div>
            {chirps}
        </div>
    );
}


export default ChirpList;