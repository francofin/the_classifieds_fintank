import { combineReducers } from "redux";
import fmpReducer from './fmp';
import idxReducer from "./idxData";
import screeneReducer from "./screenerReducer";


const rootReducer = combineReducers({
    fmp: fmpReducer,
    idx: idxReducer,
    screener:screeneReducer
})


export default rootReducer;