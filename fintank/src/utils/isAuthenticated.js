import axios from 'axios';
import swal from 'sweetalert';


export const isAuthenticatedUser = async(access_token) => {
    try {

        const response = await axios.post(`${process.env.API_URL}/token/verify/`, {
            token:access_token
        });

        if(response.status === 200) return true;
        return false

    } catch(err){
        return false
    }
}