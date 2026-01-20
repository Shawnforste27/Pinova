
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, email, password, navigate, fetchPins }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/auth/signup`,
                { name, email, password },
                { withCredentials: true }
            );
            toast.success(data.message);
            navigate('/');
            if (fetchPins) fetchPins();
            return data.user;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password, navigate }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/auth/signin`,
                { email, password },
                { withCredentials: true }
            );
            toast.success(data.message);
            navigate('/');
            return data.user;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async ({ navigate }, { rejectWithValue }) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const googleUser = result.user;

            const { data } = await axios.post(
                `${API_BASE_URL}/api/auth/google`,
                {
                    name: googleUser.displayName,
                    email: googleUser.email,
                    googleId: googleUser.uid,
                },
                { withCredentials: true }
            );

            toast.success(data.message);
            navigate('/');
            return data.user;
        } catch (error) {
            console.log(error);
            toast.error('Google Login Failed');
            return rejectWithValue('Google Login Failed');
        }
    }
);

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/user/me`, {
                withCredentials: true,
            });
            return data.user;
        } catch (error) {
            console.log('User not authenticated:', error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async ({ navigate }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/user/logout`, {
                withCredentials: true,
            });
            toast.success(data.message);
            navigate('/login');
            return null;
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(error.response?.data?.message || 'Logout failed');
            navigate('/login');
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const followUser = createAsyncThunk(
    'auth/followUser',
    async ({ userId, fetchUserCallback }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/user/follow/${userId}`,
                {},
                { withCredentials: true }
            );
            toast.success(data.message);
            if (fetchUserCallback) fetchUserCallback();
            return { userId, message: data.message };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Follow/Unfollow failed');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


const initialState = {
    user: {},
    isAuth: false,
    btnLoading: false,
    loading: true,
    error: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setIsAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        resetAuth: (state) => {
            state.user = {};
            state.isAuth = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(registerUser.pending, (state) => {
                state.btnLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.btnLoading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })


            .addCase(loginUser.pending, (state) => {
                state.btnLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.btnLoading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })


            .addCase(googleLogin.pending, (state) => {
                state.btnLoading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.btnLoading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.btnLoading = false;
                state.error = action.payload;
            })


            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.isAuth = false;
            })


            .addCase(logoutUser.fulfilled, (state) => {
                state.user = {};
                state.isAuth = false;
            })


            .addCase(followUser.pending, (state) => {
                state.btnLoading = true;
            })
            .addCase(followUser.fulfilled, (state) => {
                state.btnLoading = false;
            })
            .addCase(followUser.rejected, (state) => {
                state.btnLoading = false;
            });
    },
});

export const { setUser, setIsAuth, resetAuth } = authSlice.actions;
export default authSlice.reducer;