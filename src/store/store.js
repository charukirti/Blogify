import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import postReducer from './fetchPostSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer
    },
});