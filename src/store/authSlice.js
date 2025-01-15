import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authservice from "../services/auth";

const initialState = {
    status: false,
    userData: null,
    loading: false,
    error: null,
};

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authservice.getCurrentUser();
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {

            state.status = true;
            state.userData = action.payload.userData;
        },
        logout(state) {
            state.status = false;
            state.userData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                    state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.userData = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                    state.error = action.payload;
            });
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;