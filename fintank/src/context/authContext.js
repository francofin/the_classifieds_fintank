import {fireBaseAuth} from '@utils/fireBaseUtility';
import React, {useReducer,useState, createContext, useEffect} from 'react';
import { onAuthStateChanged, getIdTokenResult  } from "firebase/auth";
import { useRouter } from 'next/router';
import Resizer from 'react-image-file-resizer';
import axios from 'axios'
import swal from 'sweetalert';


const firebaseReducer = (state, action) => {
    switch(action.type){
        case "LOGGED_IN_USER":
            return {...state, user: action.payload}
        default:
            return state
    }
}

//reducer functions update state
const initialState = {
    user: null,
};


//create context
const AuthContext = createContext();

const DjangoAuthContext = createContext();



const DjangoAuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState(null)
    const [updated, setUpdated] = useState(null)
    const [avatar, setAvatar] = useState("")
    const [userProfile, setUserProfile] = useState(null)
    const [imageData, setImageData] = useState({})
    const [state, dispatch] = useReducer(firebaseReducer, initialState);
    const router = useRouter();


    useEffect(() => {
        if(!user){
            getCurrentUser()
            getCurrentProfile()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const login = async ({username, password}) => {
        console.log("I ran");
        
        try {
            setLoading(true);
            const res = await axios.post('/api/auth/login', 
            {username, password});
            if(res.data.success){
                getCurrentUser()
                getCurrentProfile()
                setIsAuthenticated(true);
                setLoading(false);
                router.push("/");
            }
        } catch(error){
            setLoading(false);
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    }

    const getCurrentUser = async () => {

        try {
            setLoading(true);
            const res = await axios.get('/api/auth/user');
            if(res.data.user){
                setIsAuthenticated(true);
                setLoading(false);
                setUser(res.data.user);
            }
        } catch(error){
            setLoading(false);
            setIsAuthenticated(false);
            setUser(null);
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    }


    const getCurrentProfile = async () => {

        try {
            setLoading(true);
            const res = await axios.get('/api/auth/userprofile');
            if(res.data.user_profile){
                // setIsAuthenticated(true);
                setLoading(false);
                setUserProfile(res.data.user_profile);
            }
        } catch(error){
            setLoading(false);
            setIsAuthenticated(false);
            setUserProfile(null);
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    }

    const logout = async () => {

        try {
            const res = await axios.post('/api/auth/logout');
            if(res.data.success){
                setIsAuthenticated(false);
                setUser(null);
                swal({
                    title: `Success, You have successully logged out`,
                    icon: "success",
                });
            
                router.push("/login")
                  
            }
        } catch(error){
            setLoading(false);
            setIsAuthenticated(false);
            setUser(null);
            setError(error.response && (error.response.data.detail || error.response.data.error))
        }
    }

    
    const register = async ({firstName, lastName, password, email, confirmPassword}) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/register/`, 
            {first_name:firstName, last_name:lastName, email, password, password2:confirmPassword});

            // console.log(res)
            setLoading(true);
            
            if(res.data.message){
                setLoading(false);
                router.push("/");
            }
        } catch(error){
            setLoading(false);
            setError(error.response)
        }
    }


    const handleImageUpload = async(file) => {

        Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async(uri) => {
            try{
                let {data} = await axios.post('/api/auth/uploadImages', {
                    image: uri,
                });
                // console.log(data)
                //set image in state.and loading to false.
                setAvatar(await data.Location);
                setImageData(data);
            }catch(err){
                // console.log(err);
                swal({
                    title:`Failed to Upload Image ${err}`,
                    icon: "error"
                  });
            }
        })
    }


    const handleImageRemove = async() => {
        try{
            const imageKey = user.profile_picture_cs.split("/")[3]
            await axios.post('/api/auth/removeImages', {imageKey});
            // console.log(res)
            // console.log(imageKey[3])
            
        }catch(err){
            // console.log(err);
            swal({
                title:`Failed to Upload Image ${err}`,
                icon: "error"
                });
        }
    }


    const updateUser = async( formData, access_token) => {
        try {
            setLoading(true);

            const res = await axios.put(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/updateprofile/`, 
                formData
            , {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            if(res.data){
                setLoading(false);
                setUpdated(true);
                setUser(res.data);
                swal({
                    title: `Profile Updated`,
                    icon: "success",
                });
                
            }
        } catch(err){
            swal({
                title: `Error Updating your profile`,
                icon: "error",
            });
        }
    }

    //Clear Errors
    const clearErrors = () => {
        setError(null);
    }

    
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireBaseAuth, async (user) => {
            if(user){
                const idTokenResult = await getIdTokenResult(user);

                dispatch({
                    type:'LOGGED_IN_USER',
                    payload:{email: user.email, token:idTokenResult.token}
                });
            } else{
                dispatch({
                    type:'LOGGED_IN_USER',
                    payload: null
                });
            }
        })

        return () => unsubscribe();
    }, [])

    return (
        <DjangoAuthContext.Provider value={{
            loading,
            user,
            isAuthenticated,
            error,
            login,
            logout,
            register,
            clearErrors,
            imageData,
            state,
            avatar,
            handleImageUpload,
            handleImageRemove,
            dispatch,
            updateUser,
            setUpdated,
            getCurrentProfile,
            userProfile,
            updated
        }}>
            {children}
        </DjangoAuthContext.Provider>
    )
}


//context provider
const AuthProvider = (props) => {
    const[state, dispatch] = useReducer(firebaseReducer, initialState);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireBaseAuth, async (user) => {
            if(user){
                const idTokenResult = await getIdTokenResult(user);

                dispatch({
                    type:'LOGGED_IN_USER',
                    payload:{email: user.email, token:idTokenResult.token}
                });
            } else{
                dispatch({
                    type:'LOGGED_IN_USER',
                    payload: null
                });
            }
        })

        return () => unsubscribe();
    }, [])

    const value = {state, dispatch};
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

//export

export {AuthContext, AuthProvider, DjangoAuthContext, DjangoAuthProvider};