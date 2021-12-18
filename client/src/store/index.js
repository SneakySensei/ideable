import userReducer from "./user/User.reducer";
import { combineReducers, createStore } from "redux";
const rootReducer = combineReducers({
	user: userReducer,
});

const store = createStore(rootReducer);

export default store;
