import useSWR from "swr"
import axios from 'axios'


const fetcher = async (url) => {
    const res = await axios.get(url)
    const resData = res.data
    return resData
}

// const URL = `${process.env.NEXT_PUBLIC_FMP_STOCK_PROFILE}${}?apikey=${process.env.NEXT_PUBLIC_FMP_API}`;

export const useIndexData = (index) => {

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    const {data} = useSWR(
        `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getdailydata/${index}`,
        fetcher,
        {
            refreshInterval: 50000
        }
    )

    return data
    
}