import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dbService from "../services/DatabaseService";
import { Query } from "appwrite";

export const fetchPostWithAuthor = createAsyncThunk(
    'posts/fetchPostWithAuthor',
    async (post, { rejectWithValue }) => {
        try {
            const author = await dbService.getUserId(post.author_id);
            return {
                ...post,
                author
            };
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const fetchAllPosts = createAsyncThunk(
    'posts/fetchAllPosts',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const posts = await dbService.getPosts();
            const postsWithAuthors = await Promise.all(
                posts.documents.map((post) => dispatch(fetchPostWithAuthor(post)))
            );
            return postsWithAuthors.map(result => result.payload);
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const fetchPost = createAsyncThunk(
    'posts/fetchPost',
    async (id, { rejectWithValue }) => {
        try {
            const post = await dbService.getPost(id);
            const author = await dbService.getUserId(post.author_id);
            return { ...post, author };
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const fetchAuthorPosts = createAsyncThunk(
    'posts/fetchAuthorPosts',
    async (id, { rejectWithValue }) => {
        try {
            const posts = await dbService.getPosts([Query.equal('author_id', id)]);
            return posts.documents;
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

const initialState = {
    posts: [],
    post: null,
    authorPosts: [],
    loading: false,
    error: null
};

const fetchPostSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentPosts: (state) => {
            state.post = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
            })
            .addCase(fetchPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAuthorPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuthorPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.authorPosts = action.payload;
            })
            .addCase(fetchAuthorPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearCurrentPosts } = fetchPostSlice.actions;

export default fetchPostSlice.reducer;