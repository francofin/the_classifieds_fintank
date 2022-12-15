const screeneReducer = (state = [], action) => {
    
    
    if(action.type ==='updateScreen'){
        console.log("Screener is Running")
        console.log(action)
        let newState = [...state]
        if(action.payload.screenResults){
            newState = action.payload.screenResults
        }
        return newState
    } else {
        return state
    }

    
}


export default screeneReducer