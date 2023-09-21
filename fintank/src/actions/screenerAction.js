import axios from 'axios'
import swal from 'sweetalert';


const getScreenResults = async(screenData) => {
    console.log(screenData)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/screen/`, screenData);
    console.log(res)
    try{
        
        console.log(res)
        if(res.data){
            console.log(res.data)
            swal({
                title: `Screen Run Successfully`,
                icon: "success",
            });
            const screenedData = await res.data.screen_results 
            console.log(screenedData)
            return screenedData
        }
    } catch(err){
        swal({
            title: `No Results Found In Your Screen, Please Reset Your Parameters`,
            icon: "error",
        });
    }
}

const screenerAction = async (formData) => {
    const screenResults = await getScreenResults(formData)

    return{
        type:'updateScreen',
        payload:{
            formData,
            screenResults
        }
    }
}


export default screenerAction