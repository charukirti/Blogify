import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import postReducer from './fetchPostSlice';
import interactionsReducer from './interactionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        interactions: interactionsReducer
    },
});