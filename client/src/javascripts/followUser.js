import axios from 'axios';


const followUser = async (userId,authUser) => {
    try {
        const data = {
            actionUsername: userId,
            reqUserId: authUser
        }
        axios.post('/:userId', data)
            .then(response => {
                console.log(response.data)
                if (response.status === 200) {
                    console.log('post req made!')
                }
            })
    } catch (error) {

    }
}

export default followUser;