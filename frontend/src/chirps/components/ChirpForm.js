import React from "react";
import useInputState from "../../hooks/useInputState";

function ChirpForm(props) {
    const { addChirp } = props;

    const [value, handleChange, reset] = useInputState("");
    return (
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addChirp(value);
                    reset();
                }}
            >
                <input
                    type='text'
                    name='info'
                    onChange={handleChange}
                    value={value}
                    id='info'
                    placeholder='What is happening?'
                />
                <button>Send Chirp</button>
            </form>
    );
}


export default ChirpForm;