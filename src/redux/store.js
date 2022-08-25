import { configureStore} from "@reduxjs/toolkit"
import { authReducer } from "./slice/auth";
import { postsReducer } from "./slice/post";


const store = configureStore({
  reducer:{
    posts: postsReducer,
    auth: authReducer,
  }
});

export default store;