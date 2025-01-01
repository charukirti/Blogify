import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import interactionService from "../services/interactionService";

const initialState = {
    likesCount: {}, // blogId: number/count
    hasLiked: {}, // blogId: boolean
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
                });
        },
});

export const { updateLikesCount, setHasLiked } = interactionSlice.actions;

export default interactionSlice.reducer;

