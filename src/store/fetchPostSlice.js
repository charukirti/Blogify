import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dbService from "../services/DatabaseService";
import authservice from "../services/auth";
import { Query } from "appwrite";
import bucketService from "../services/bucketService";

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
    async (_, { rejectWithValue }) => {
        try {
            const user = await authservice.getCurrentUser();

            const posts = await dbService.getPosts([Query.equal('author_id', user.$id)]);


            const postsWithAuthors = posts.documents.map(post => ({
                ...post,
                author: user
            }));

            return postsWithAuthors;
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const fetchAuthorPostsIds = createAsyncThunk(
    'post/fetchAuthorPostsIds',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authservice.getCurrentUser();
            const posts = await dbService.getPosts([Query.equal('author_id', user.$id)]);

            const postIds = posts.documents.map(post => post.$id);

            return postIds;
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async ({ postId, fileId }, { rejectWithValue }) => {
        try {
            await Promise.all(
                [
                    dbService.deletePost(postId),
                    bucketService.deleteFile(fileId)
                ]
            );
            return postId;
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

const initialState = {
    posts: [],
    post: null,
    authorPosts: [],
    authorPostsIds: [],
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
            })
            .addCase(fetchAuthorPostsIds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuthorPostsIds.fulfilled, (state, action) => {
                state.loading = false;
                state.authorPostsIds = action.payload;
            })
            .addCase(fetchAuthorPostsIds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter(post => post.$id !== action.payload);
                state.authorPosts = state.authorPosts.filter(authorPost => authorPost.$id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearCurrentPosts } = fetchPostSlice.actions;

export default fetchPostSlice.reducer;