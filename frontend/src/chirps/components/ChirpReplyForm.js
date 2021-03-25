import React from "react";
import useInputState from "../../hooks/useInputState";

function ChirpReplyForm(props) {
    const { addReply, id } = props;

    const [value, handleChange, reset] = useInputState("");
    return (
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addReply(id,value);
                    reset();
                }}
            >
                <input
                    type='text'
                    name='info'
                    onChange={handleChange}
                    value={value}
                    id='info'
                    placeholder='Reply'
                />
                <button>Chirp your reply</button>
            </form>
    );
}


export default ChirpReplyForm;