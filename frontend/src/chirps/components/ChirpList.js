import React from "react";
import Chirp from "./Chirp";


function ChirpList(props) {
    const { allChirps, removeChirp, likeChirp, reChirp, addReply } = props;
    const chirps = allChirps.map(c => (
        <Chirp
            key={c.id} {...c}
            removeChirp={removeChirp}
            likeChirp={likeChirp}
            reChirp={reChirp}
            addReply={addReply}
            
        />
    ))

    return (
        <div>
            {chirps}
        </div>
    );
}


export default ChirpList;