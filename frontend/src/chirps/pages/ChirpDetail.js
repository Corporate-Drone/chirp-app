import React from "react";
import Chirp from "../components/Chirp";
import ChirpReplyForm from "../components/ChirpReplyForm";

import useToggleState from "../../hooks/useToggleState";

function ChirpDetail(props) {
    return (
        <div>
            <Chirp />
            <ChirpReplyForm />
        </div>
    );
}

export default ChirpDetail;