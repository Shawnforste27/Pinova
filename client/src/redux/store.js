
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pinReducer from './slices/pinSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pin: pinReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;