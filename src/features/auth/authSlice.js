import { signIn, signOut, createAccount, getCurrentUser, getAvatarInitials } from "../../services/auth";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    status: "idle",
    isUserLoggedIn: false,
    userData: null,
    error: '',
    signUpError: '',
    signInError: '',
    signOutError: '',
};

export const signup = createAsyncThunk(
    "auth/signup",
    async ({ email, password, name }) => {
        const session = await createAccount({
            email,
            password,
            name,
        });
        if (session) {
            const response = await getCurrentUser();
            if (response) {
                const avatar = getAvatarInitials(response.name);
                return { ...response, avatar };
            }
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }) => {
        const session = await signIn({ email, password });
        if (session) {
            const response = await getCurrentUser();
            if (response) {
                const avatar = getAvatarInitials(response.name);
                return { ...response, avatar };
            }
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    await signOut();
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.signUpError = '';
                state.isUserLoggedIn = true;
                state.userData = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = "failed";
                state.signUpError = action.error.message;
                state.isUserLoggedIn = false;
                state.userData = null;
            })
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.signInError = '';
                state.isUserLoggedIn = true;
                state.userData = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.signInError = action.error.message;
                state.isUserLoggedIn = false;
                state.userData = null;
            });

    }
});


export default authSlice.reducer;