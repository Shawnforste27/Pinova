
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


export const fetchPins = createAsyncThunk(
    'pin/fetchPins',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/pin/all`);
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPin = createAsyncThunk(
    'pin/fetchPin',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/pin/${id}`);
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const updatePin = createAsyncThunk(
    'pin/updatePin',
    async ({ id, title, pin, setEdit }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.put(`${API_BASE_URL}/api/pin/${id}`, { title, pin });
            toast.success(data.message);
            dispatch(fetchPin(id));
            if (setEdit) setEdit(false);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update pin');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const addComment = createAsyncThunk(
    'pin/addComment',
    async ({ id, comment, setComment }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/pin/comment/${id}`, { comment });
            toast.success(data.message);
            dispatch(fetchPin(id));
            if (setComment) setComment('');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteComment = createAsyncThunk(
    'pin/deleteComment',
    async ({ id, commentId }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.delete(
                `${API_BASE_URL}/api/pin/comment/${id}?commentId=${commentId}`
            );
            toast.success(data.message);
            dispatch(fetchPin(id));
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete comment');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deletePin = createAsyncThunk(
    'pin/deletePin',
    async ({ id, navigate }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.delete(`${API_BASE_URL}/api/pin/${id}`);
            toast.success(data.message);
            navigate('/');
            dispatch(fetchPins());
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete pin');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const addPin = createAsyncThunk(
    'pin/addPin',
    async (
        { formData, setFilePrev, setFile, setTitle, setPin, navigate },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/pin/new`, formData, {
                withCredentials: true,
            });
            toast.success(data.message);
            if (setFile) setFile([]);
            if (setFilePrev) setFilePrev('');
            if (setPin) setPin('');
            if (setTitle) setTitle('');
            dispatch(fetchPins());
            navigate('/');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create pin');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


const initialState = {
    pins: [],
    pin: null,
    loading: true,
    btnLoading: false,
    error: null,
};


const pinSlice = createSlice({
    name: 'pin',
    initialState,
    reducers: {
        clearPin: (state) => {
            state.pin = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchPins.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPins.fulfilled, (state, action) => {
                state.loading = false;
                state.pins = action.payload;
            })
            .addCase(fetchPins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(fetchPin.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPin.fulfilled, (state, action) => {
                state.loading = false;
                state.pin = action.payload;
            })
            .addCase(fetchPin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updatePin.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(updatePin.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(updatePin.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })


            .addCase(addComment.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(addComment.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(addComment.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })


            .addCase(deleteComment.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(deleteComment.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })


            .addCase(deletePin.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePin.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deletePin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(addPin.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(addPin.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(addPin.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPin } = pinSlice.actions;
export default pinSlice.reducer;