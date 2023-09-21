const initState = {"stocks":[], "query":{}}

const screeneReducer = (state = initState, action) => {
    
    
    if(action.type ==='updateScreen'){
        // console.log(action)
        console.log("Screener is Running")
        console.log(action.payload.screenResults)
        return action.payload.screenResults
        // let newState = [...action?.payload?.screenResults]
        // if(action.payload.screenResults){
        //    return action.payload.screenResults
        // }
        // return state
    } else {
        return state
    }

    
}


export default screeneReducer