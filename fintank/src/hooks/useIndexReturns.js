import useSWR from "swr"
import axios from 'axios'


const fetcher = async (url) => {
    const res = await axios.get(url)
    const resData = res.data
    return resData
}

export const useIndexData = (index) => {

    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getdailyindexdata/${index}/`,
        fetcher,
        {
            refreshInterval: 5000000
        }
    )

    return data
    
}