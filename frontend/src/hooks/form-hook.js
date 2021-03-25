import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) { //continue if undefined (continue to next inputId)
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid; //formIsValid = false if action.isValid is false
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid //formIsValid = false if state.inputs[inputId].isValid is false
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            }
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            }
        default:
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, { //initial state
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })
    }, []) //function is reused instead of rerendered, useEffect not run again (video 59 6:20)

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        })
    }, [])

    return [formState, inputHandler, setFormData]
}




