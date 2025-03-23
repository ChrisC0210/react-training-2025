import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './slices/toastSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
    reducer: {
        toast: toastReducer,
        cart: cartReducer, 
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
