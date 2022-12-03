import { combineReducers } from "redux";
import fmpReducer from './fmp';
import idxReducer from "./idxData";


const rootReducer = combineReducers({
    fmp: fmpReducer,
    idx: idxReducer
})


export default rootReducer;