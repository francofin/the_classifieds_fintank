import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers/rootReducer";

// initial states here
const initalState = {};

// middleware
const middleware = [thunk];

// creating store
const theStore = createStore(
  rootReducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// assigning store to next wrapper
const makeStore = () => theStore;

const wrapper = createWrapper(makeStore);

module.exports = {
    theStore,
    wrapper
}

