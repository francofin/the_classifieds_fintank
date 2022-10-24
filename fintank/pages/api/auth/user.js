import axios from 'axios';
import cookie from 'cookie';

export default async (req, res) => {
    console.log(req)
    if (req.method === 'GET'){
        const cookies = cookie.parse(req.headers.cookie || '')
        const access = cookies.access || false;
        if (!access) {
            return res.status(401).json({
              message: "Login first to get User Details",
            });
          }
        
          
        try{
            const response = await axios.get(`${process.env.FINTANK_API_URL}/userprofile/`, {
                headers: {
                  Authorization: `Bearer ${access}`,
                },
              });
              if (response.data) {
                return res.status(200).json({
                  user: response.data,
                });
              }
        } catch(error){
            console.log(error);
            res.status(error?.response.status).json({
                error: 'Something Went Wrong while getting your details, Please try to log in again'
            })
        }
    }
};