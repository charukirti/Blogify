import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import interactionService from "../services/interactionService";

const initialState = {
    likesCount: {},
    hasLiked: {},
    comments: {},
    commentsCount: {},
    viewsCount: {},
    loading: false,
    error: null,
};

export const fetchLikesCount = createAsyncThunk(
    'interactions/fetchLikesCount',
    async (blogId, { rejectWithValue }) => {
        try {
            const count = await interactionService.getLikesCount(blogId);
            return { blogId, count };
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
);

export const checkHasLiked = createAsyncThunk(
    'interactions/checkHasLiked',
    async ({ blogId, userId }, { rejectWithValue }) => {
        try {
            if (!blogId || !userId) return { blogId, hasLiked: false };
            const hasLiked = await interactionService.hasLiked(blogId, userId);
            return { blogId, hasLiked };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchComments = createAsyncThunk(
    'interactions/fetchComments',
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await interactionService.getBlogComments(blogId);
            return {
                blogId,
                comments: response.documents,
                total: response.total
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCommentsCount = createAsyncThunk(
    'interactons/fetchCommentsCount',
    async (blogId, { rejectWithValue }) => {
        try {
            const total = await interactionService.getCommentsCount(blogId);
            return { blogId, total };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchViews = createAsyncThunk(
    'interactions/fetchViews',
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await interactionService.getViewsCount(blogId);
            return {
                blogId,
                views: response?.views || 0
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
const interactionSlice = createSlice({
    name: 'interactions',
    initialState,
    reducers: {
        updateLikesCount: (state, action) => {
            const { blogId, likesChange } = action.payload;
            if (state.likesCount[blogId] !== undefined) {
                state.likesCount[blogId] += likesChange;
            } else {
                state.likesCount[blogId] = Math.max(likesChange, 0);
            }
        },
        setHasLiked: (state, action) => {
            const { blogId, hasLiked } = action.payload;
            state.hasLiked[blogId] = hasLiked;
        },

        addComment: (state, action) => {
            const { blogId, comment } = action.payload;
            if (!state.comments[blogId]) {
                state.comments[blogId] = [];
            }
            state.comments[blogId].unshift(comment);

            // update the count
            state.commentsCount[blogId] = (state.commentsCount[blogId] || 0) + 1;
        },
        updateComment: (state, action) => {
            const { blogId, commentId, content } = action.payload;

            if (state.comments[blogId]) {
                const comment = state.comments[blogId].find(c => c.$id === commentId);

                if (comment) {
                    comment.content = content;
                }
            }
        },
        deleteComment: (state, action) => {
            const { blogId, commentId } = action.payload;
            if (state.comments[blogId]) {
                state.comments[blogId] = state.comments[blogId].filter(c => c.$id !== commentId);

                state.commentsCount[blogId] = (state.commentsCount[blogId] || 0) - 1;
            }
        },
        setViewsCount: (state, action) => {
            const { blogId, views } = action.payload;
            state.viewsCount[blogId] = views;
        }

    },
    extraReducers:
        (builder) => {
            builder
                .addCase(fetchLikesCount.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchLikesCount.fulfilled, (state, action) => {
                    const { blogId, count } = action.payload;
                    state.likesCount[blogId] = count;
                    state.loading = false;

                })
                .addCase(fetchLikesCount.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(checkHasLiked.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(checkHasLiked.fulfilled, (state, action) => {
                    const { blogId, hasLiked } = action.payload;
                    state.hasLiked[blogId] = hasLiked;
                    state.loading = false;
                })
                .addCase(checkHasLiked.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(fetchComments.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchComments.fulfilled, (state, action) => {
                    const { blogId, comments, total } = action.payload;
                    state.comments[blogId] = comments;
                    state.commentsCount[blogId] = total;
                    state.loading = false;
                })
                .addCase(fetchComments.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(fetchCommentsCount.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchCommentsCount.fulfilled, (state, action) => {
                    const { blogId, total } = action.payload;
                    state.commentsCount[blogId] = total;
                })
                .addCase(fetchCommentsCount.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(fetchViews.pending, (state) => {
                    state.loading = true;
                    state.error = false;
                })
                .addCase(fetchViews.fulfilled, (state, action) => {
                    const { blogId, views } = action.payload;
                    state.viewsCount[blogId] = views;
                    state.loading = false;
                })
                .addCase(fetchViews.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        },
});

export const {
    updateLikesCount,
    setHasLiked,
    addComment,
    updateComment,
    deleteComment,
    setViewsCount
} = interactionSlice.actions;

export default interactionSlice.reducer;

